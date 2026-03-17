'use client'

import { Avatar, Button, Typography } from '@/shared/ui'
import { getTimeDifference } from '@/shared/lib/getTimeDifference'
import { Comment } from '@/entities/posts/api/types'
import s from './CommentItem.module.css'
import { CreateAnswerForm } from '@/entities/posts/ui/CreateAnswerForm'
import { useState } from 'react'
import { AnswersList } from '@/features/posts/post-comments/ui/AnswerList'
import { LikeButton } from '@/shared/ui/like-button'

type CommentItemProps = {
  comment: Comment
  user?: number
  showLike?: boolean
}

/**
 * Компонент для отображения одного комментария
 * Показывает аватар, имя пользователя, текст комментария и время создания
 */
export const CommentItem = ({ comment, showLike }: CommentItemProps) => {
  const userAvatar = comment.from.avatars?.[0]?.url || ''
  const userName = comment.from.username
  const [showAnswerForm, setShowAnswerForm] = useState(false)
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
        <div>
          <div>
            <time className={s.timestamp} dateTime={comment.createdAt}>
              {getTimeDifference(comment.createdAt, 'ru')}
            </time>
            <LikeButton postId={comment.postId} initialIsLiked={comment.isLiked} />
          </div>
          <Button
            className={s.answerBtn}
            variant={'textButton'}
            onClick={() => setShowAnswerForm((prevState) => !prevState)}
          >
            <Typography variant={'bold_small'}>Answer</Typography>
          </Button>
          {showAnswerForm && <CreateAnswerForm postId={comment.postId} commentId={comment.id} />}
        </div>
        <AnswersList postId={comment.postId} commentId={comment.id} answerCount={comment.answerCount} />
      </div>
    </li>
  )
}
