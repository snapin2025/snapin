'use client'

import { Avatar } from '@/shared/ui'
import { Comment } from '@/entities/posts/api/types'
import s from './CommentItem.module.css'

type CommentItemProps = {
  comment: Comment
  user?: number
  showLike?: boolean
}

/**
 * Компонент для отображения одного комментария
 * Показывает аватар, имя пользователя, текст комментария и время создания
 */
export const AnswerItem = ({ comment, showLike }: CommentItemProps) => {
  const userAvatar = comment.from.avatars?.[0]?.url || ''
  const userName = comment.from.username

  return (
    <li className={s.comment}>
      <Avatar src={userAvatar} alt={userName} size="small" />
      <div className={s.commentContent}>
        <div className={s.commentTop}>
          <div className={s.commentHeader}>
            <span className={s.userName}>{userName}</span>
            <span className={s.commentText}>{comment.content}</span>
          </div>
          {showLike && <button type="button" className={s.likeButton} aria-label="Like comment"></button>}
        </div>
      </div>
    </li>
  )
}
