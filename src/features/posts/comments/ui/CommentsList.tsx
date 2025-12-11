'use client'

import { CommentItem } from './CommentItem'
import { Spinner } from '@/shared/ui'
import s from './CommentsList.module.css'
import { useComments } from '@/features/posts/comments/api/useComments'

type CommentsListProps = {
  postId: number
  user?: number
}

/**
 * Компонент для отображения списка комментариев
 * Загружает комментарии через API и отображает их
 */
export const CommentsList = ({ postId, user }: CommentsListProps) => {
  const { data, isLoading, error } = useComments({ postId })

  if (isLoading) {
    return (
      <div className={s.loading}>
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className={s.error}>
        <p>Не удалось загрузить комментарии</p>
      </div>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <div className={s.empty}>
        <p>Пока нет комментариев</p>
      </div>
    )
  }

  return (
    <div className={s.commentsList}>
      {data.items.map((comment) => (
        <CommentItem user={user} key={comment.id} comment={comment} showLike={!!user} />
      ))}
    </div>
  )
}
