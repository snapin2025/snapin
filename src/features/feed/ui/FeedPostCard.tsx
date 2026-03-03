'use client'

import { HomePostsList } from '@/widgets/homePostsList'
import { DropMenu } from '@/shared/ui/dropdown/DropMenu'
import { useMe } from '@/shared/api'
import { Post } from '@/entities/posts/api/types'
import s from './FeedPostCard.module.css'
import { useFollow } from '@/features/feed/hooks/useFollow'
import { Avatar } from '@/shared/ui/Avatar'
import { getTimeDifference } from '@/shared/lib/getTimeDifference'
import { useState } from 'react'
import { Bookmark, Button, Message, Telegram } from '@/shared/ui'
import Link from 'next/link'
import { PostLikes } from '@/features/posts/view-post/ui'
import { LikeButton } from '@/shared/ui/like-button'
import { CommentForm } from '@/shared/ui/comment-form'
import { CreateCommentResponse } from '@/features/posts/post-comments/model/types'
import { useComments } from '@/features/posts/post-comments/api/useComments'
// добавляем хук для получения комментариев

type FeedPostCardProps = {
  post: Post
  currentUserId?: number | null
  isFollowing: boolean
}

export const FeedPostCard = ({
  post,
  isFollowing: initialIsFollowing,
  currentUserId: propCurrentUserId
}: FeedPostCardProps) => {
  const { data: user } = useMe()

  // Состояние для новых комментариев
  const [newComments, setNewComments] = useState<CreateCommentResponse[]>([])
  // Состояние для счетчика
  const [commentsCount, setCommentsCount] = useState(0)

  // получаем комментарии с сервера
  const { data: serverComments } = useComments({ postId: post.id })
  // объединяем комментарии с сервера и новые
  const allComments = [...(serverComments?.items || []), ...newComments]
  // общее количество комментариев
  const totalCommentsCount = (serverComments?.items?.length || 0) + newComments.length

  const { follow, unfollow } = useFollow()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)

  const currentUserId = propCurrentUserId ?? user?.userId ?? null

  const handleFollow = () => {
    follow(post.ownerId)
    setIsFollowing(true)
  }

  const handleUnfollow = () => {
    unfollow(post.ownerId)
    setIsFollowing(false)
  }

  return (
    <div className={s.container}>
      {/* верхний блок */}
      <div className={s.postHeader}>
        <div className={s.userInfo}>
          <Avatar src={post.avatarOwner} alt={post.userName} size="small" />
          <div className={s.userMeta}>
            <span className={s.userName}>{post.userName}</span>
            <span className={s.dot}>·</span>
            <span className={s.time}>{getTimeDifference(post.createdAt)}</span>
          </div>
        </div>
        <DropMenu
          ownerId={post.ownerId}
          currentUserId={currentUserId}
          isFollowing={isFollowing}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
        />
      </div>
      {/*использую этотот файл так как внем написана до меня заглушка*/}
      <HomePostsList post={post} />

      <div className={s.actionsContainer}>
        <div className={s.actionsLeft}>
          <LikeButton postId={post.id} initialIsLiked={post.isLiked} />
          <Button className={s.socialButton}>
            <Message className={s.icon} />
          </Button>
          <Button className={s.socialButton}>
            <Telegram className={s.icon} />
          </Button>
        </div>
        <Button className={s.socialButton}>
          <Bookmark className={s.icon} />
        </Button>
      </div>

      {/* Аватар + имя поста */}
      <div className={s.userInfo}>
        <Avatar src={post.avatarOwner} alt="Avatar Image" size="small" />
        <div className={s.userMeta}>
          <Link className={s.userName} href={`/profile/${post.ownerId}`} prefetch={true}>
            <span className={s.userName}>{post.userName}</span>
          </Link>
          <span className={s.descriptionText}>{post.description}</span>
        </div>
      </div>

      {/* ЛАЙКИ */}
      <PostLikes key={post.id} likesCount={post.likesCount} avatars={post.avatarWhoLikes} />

      {/* показываем все комментарии (и с сервера, и новые) */}
      {allComments.length > 0 && (
        <div className={s.commentsList}>
          {allComments.map((comment) => (
            <div key={`${comment.id}-${Math.random()}`} className={s.commentItem}>
              {/*<div key={comment.id} className={s.commentItem}>*/}
              <Avatar src={comment.from?.avatars?.[0]?.url || ''} alt={comment.from?.username || 'User'} size="small" />
              <span className={s.userName}>{comment.from?.username}</span>
              <span className={s.commentText}>{comment.content}</span>
            </div>
          ))}
        </div>
      )}

      {/* счетчик комментариев (обновленный) */}
      <div className={s.commentsLink}>View All Comments ({totalCommentsCount})</div>

      {/* форма комментария */}
      <CommentForm
        postId={post.id}
        onSuccess={(newComment: CreateCommentResponse) => {
          setNewComments((prev) => [...prev, newComment])
          setCommentsCount((prev) => prev + 1)
        }}
      />

      <div className={s.divider} />
    </div>
  )
}
