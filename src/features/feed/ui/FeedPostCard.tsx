// 'use client'
//
// import { HomePostsList } from '@/widgets/homePostsList'
// import { DropMenu } from '@/shared/ui/dropdown/DropMenu'
// import { useMe } from '@/shared/api'
// import { Post } from '@/entities/posts/api/types'
// import s from './FeedPostCard.module.css'
// import { useFollow } from '@/features/feed/hooks/useFollow'
// import { Avatar } from '@/shared/ui/Avatar'
// import { getTimeDifference } from '@/shared/lib/getTimeDifference'
// import { useState } from 'react'
// import { Bookmark, Button, Message, Telegram } from '@/shared/ui'
// import Link from 'next/link'
// import { PostLikes } from '@/features/posts/view-post/ui'
// import { LikeButton } from '@/shared/ui/like-button'
// import { CommentForm } from '@/shared/ui/comment-form'
// import { CreateCommentResponse } from '@/features/posts/post-comments/model/types'
// import { useComments } from '@/features/posts/post-comments/api/useComments'
//
// type FeedPostCardProps = {
//   post: Post
//   currentUserId?: number | null
//   isFollowing: boolean
// }
//
// export const FeedPostCard = ({
//   post,
//   isFollowing: initialIsFollowing,
//   currentUserId: propCurrentUserId
// }: FeedPostCardProps) => {
//   const { data: user } = useMe()
//
//   // Состояние для новых комментариев
//   const [newComments, setNewComments] = useState<CreateCommentResponse[]>([])
//
//   // получаем комментарии с сервера
//   const { data: serverComments } = useComments({ postId: post.id })
//   // объединяем комментарии с сервера и новые
//   const allComments = [...(serverComments?.items || []), ...newComments]
//   // общее количество комментариев
//   const totalCommentsCount = (serverComments?.items?.length || 0) + newComments.length
//
//   const { follow, unfollow } = useFollow()
//   const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
//
//   const currentUserId = propCurrentUserId ?? user?.userId ?? null
//
//   const handleFollow = () => {
//     follow(post.ownerId)
//     setIsFollowing(true)
//   }
//
//   const handleUnfollow = () => {
//     unfollow(post.ownerId)
//     setIsFollowing(false)
//   }
//
//   return (
//     <div className={s.container}>
//       {/* верхний блок */}
//       <div className={s.postHeader}>
//         <div className={s.userInfo}>
//           <Avatar src={post.avatarOwner} alt={post.userName} size="small" />
//           <div className={s.userMeta}>
//             <span className={s.userName}>{post.userName}</span>
//             <span className={s.dot}>·</span>
//             <span className={s.time}>{getTimeDifference(post.createdAt)}</span>
//           </div>
//         </div>
//         <DropMenu
//           ownerId={post.ownerId}
//           currentUserId={currentUserId}
//           isFollowing={isFollowing}
//           onFollow={handleFollow}
//           onUnfollow={handleUnfollow}
//         />
//       </div>
//       {/*использую этотот файл так как внем написана до меня заглушка*/}
//       <HomePostsList post={post} />
//
//       <div className={s.actionsContainer}>
//         <div className={s.actionsLeft}>
//           <LikeButton postId={post.id} initialIsLiked={post.isLiked} />
//           <Button className={s.socialButton}>
//             <Message className={s.icon} />
//           </Button>
//           <Button className={s.socialButton}>
//             <Telegram className={s.icon} />
//           </Button>
//         </div>
//         <Button className={s.socialButton}>
//           <Bookmark className={s.icon} />
//         </Button>
//       </div>
//
//       {/* Аватар + имя поста */}
//       <div className={s.userInfo}>
//         <Avatar src={post.avatarOwner} alt="Avatar Image" size="small" />
//         <div className={s.userMeta}>
//           <Link className={s.userName} href={`/profile/${post.ownerId}`} prefetch={true}>
//             <span className={s.userName}>{post.userName}</span>
//           </Link>
//           <span className={s.descriptionText}>{post.description}</span>
//         </div>
//       </div>
//
//       {/* ЛАЙКИ */}
//       <PostLikes key={post.id} likesCount={post.likesCount} avatars={post.avatarWhoLikes} />
//
//       {/* показываем все комментарии (и с сервера, и новые) */}
//       {allComments.length > 0 && (
//         <div className={s.commentsList}>
//           {allComments.map((comment) => (
//             <div key={`${comment.id}-${Math.random()}`} className={s.commentItem}>
//               <Avatar src={comment.from?.avatars?.[0]?.url || ''} alt={comment.from?.username || 'User'} size="small" />
//               <span className={s.userName}>{comment.from?.username}</span>
//               <span className={s.commentText}>{comment.content}</span>
//             </div>
//           ))}
//         </div>
//       )}
//
//       {/* счетчик комментариев (обновленный) */}
//       <div className={s.commentsLink}>View All Comments ({totalCommentsCount})</div>
//
//       {/* форма комментария */}
//       <CommentForm
//         postId={post.id}
//         onSuccess={(newComment: CreateCommentResponse) => {
//           setNewComments((prev) => [...prev, newComment])
//         }}
//       />
//
//       <div className={s.divider} />
//     </div>
//   )
// }

//2
'use client'

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
import { LikeButton } from '@/shared/ui/like-button'
import { CommentForm } from '@/shared/ui/comment-form'
import { PostImageSlider } from '@/shared/lib/post-image-slider'
import { useComments } from '@/features/posts/post-comments/api/useComments'

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
  const [isAllCommentsVisible, setIsAllCommentsVisible] = useState(false)

  // Состояние для новых комментариев
  const [newComments, setNewComments] = useState<CreateCommentResponse[]>([])

  // 🔽 НОВОЕ: состояние для открытия/закрытия комментариев
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)

  // получаем комментарии с сервера
  const { data: serverComments } = useComments({ postId: post.id })
  const allComments = Array.from(
    new Map((serverComments?.items ?? []).map((comment) => [comment.id, comment])).values()
  )
  const latestComment =
    allComments.length > 0
      ? allComments.reduce((latest, comment) =>
          new Date(comment.createdAt).getTime() > new Date(latest.createdAt).getTime() ? comment : latest
        )
      : null
  const visibleComments = isAllCommentsVisible ? allComments : latestComment ? [latestComment] : []
  const totalCommentsCount = allComments.length

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

  const likesAvatars = Array.isArray(post.avatarWhoLikes) ? post.avatarWhoLikes : []
  const hasImages = post.images && post.images.length > 0
  const safeLikesCount = Number.isFinite(post.likesCount) ? post.likesCount : 0
  const likesLabel = `${safeLikesCount.toLocaleString('ru-RU')} Likes`

  return (
    <div className={s.container}>
      <div className={s.postHeader}>
        <div className={s.headerUserInfo}>
          <Avatar src={post.avatarOwner} alt={post.userName} size="small" />
          <div className={s.headerMeta}>
            <span className={s.headerUserName}>{post.userName}</span>
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

      <div className={s.media}>
        {hasImages ? (
          <PostImageSlider
            images={post.images}
            postId={post.id}
            ownerId={post.ownerId}
            description={post.description}
            disableLink={true}
            size={'large'}
            className={s.slider}
          />
        ) : (
          <div className={s.mediaPlaceholder}>No image</div>
        )}
      </div>

      <div className={s.actionsContainer}>
        <div className={s.actionsLeft}>
          <LikeButton className={s.socialButton} postId={post.id} initialIsLiked={post.isLiked} />
          <Button className={s.socialButton} aria-label="Open comments">
            <Message className={s.icon} />
          </Button>
          <Button className={s.socialButton} aria-label="Share post">
            <Telegram className={s.icon} />
          </Button>
        </div>
        <Button className={s.socialButton} aria-label="Save post">
          <Bookmark className={s.icon} />
        </Button>
      </div>

      <div className={s.caption}>
        <Avatar src={post.avatarOwner} alt={post.userName} size="small" />
        <div className={s.captionText}>
          <Link className={s.captionUserName} href={`/profile/${post.ownerId}`} prefetch={true}>
            <span className={s.captionUserName}>{post.userName}</span>
          </Link>
          <span className={s.description}>{post.description}</span>
        </div>
      </div>

      {/* ЛАЙКИ */}
      <PostLikes key={post.id} likesCount={post.likesCount} avatars={post.avatarWhoLikes} />

      {/*  показываем комментарии только если isCommentsOpen = true */}
      {isCommentsOpen && allComments.length > 0 && (
        <div className={s.commentsList}>
          {visibleComments.map((comment) => (
            <div key={`${comment.id}-${comment.createdAt}`} className={s.commentItem}>
              <Avatar src={comment.from?.avatars?.[0]?.url || ''} alt={comment.from?.username || 'User'} size="small" />
              <span className={s.commentUserName}>{comment.from?.username}</span>
              <span className={s.commentText}>{comment.content}</span>
            </div>
          ))}
        </div>
      )}

      {/*счетчик теперь кликабельный */}
      <div className={s.commentsLink} onClick={() => setIsCommentsOpen(!isCommentsOpen)} style={{ cursor: 'pointer' }}>
        View All Comments ({totalCommentsCount})
      </div>

      <div className={s.likesBlock}>
        {likesAvatars.length > 0 && (
          <div className={s.likesAvatars}>
            {likesAvatars.slice(0, 3).map((src, i) => (
              <Avatar key={i} src={src} size="very_small" alt={`like-avatar-${i}`} />
            ))}
          </div>
        )}
        <span className={s.likesCount}>{likesLabel}</span>
      </div>

      <div className={s.divider} />
    </div>
  )
}
