'use client'

import { PostImageSlider } from '@/shared/lib/post-image-slider'
import { CommentsList } from '@/features/posts/post-comments'
import { PostModalHeader } from './PostModalHeader'
import { PostModalFooter } from './PostModalFooter'
import { Post } from '@/entities/posts/api/types'
import s from './PostModal.module.css'

type PostModalContentProps = {
  post: Post
  currentUserId: number | null
  onEdit: () => void
  onDelete: () => void
}

export const PostModalContent = ({ post, currentUserId, onEdit, onDelete }: PostModalContentProps) => {
  return (
    <div className={s.postContainer}>
      {/* Левая часть - карусель изображений */}
      <div className={s.imageSection}>
        <PostImageSlider
          images={post.images}
          postId={post.id}
          ownerId={post.ownerId}
          description={post.description}
          disableLink={true}
          className={s.modalSlider}
          size="large"
        />
      </div>

      {/* Правая часть - комментарии и информация */}
      <div className={s.sidebar}>
        <PostModalHeader
          userName={post.userName}
          avatarOwner={post.avatarOwner}
          ownerId={post.ownerId}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        {/* Комментарии */}
        <section className={s.comments} aria-label="Комментарии">
          <CommentsList postId={post.id} user={currentUserId ?? undefined} />
        </section>

        <PostModalFooter avatarWhoLikes={post.avatarWhoLikes} likesCount={post.likesCount} createdAt={post.createdAt} />
      </div>
    </div>
  )
}
