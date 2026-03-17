import { useAnswers } from '@/entities/posts/model/useAnswer'
import { CommentItem } from './CommentItem'
import { Button, CommentsSkeleton, Typography } from '@/shared/ui'
import s from './CommentsList.module.css'
import { useState } from 'react'
import { AnswerItem } from '@/features/posts/post-comments/ui/AnswerItem'

export const AnswersList = ({
  postId,
  commentId,
  answerCount
}: {
  postId: number
  commentId: number
  answerCount: number
}) => {
  const { data, isLoading } = useAnswers({ postId, commentId })
  const [showAnswers, setShowAnswers] = useState(false)
  if (isLoading) return <CommentsSkeleton />

  if (!data?.items.length) return null

  return (
    <>
      <Button
        variant={'textButton'}
        className={s.showAnswers}
        onClick={() => setShowAnswers((prevState) => !prevState)}
      >
        <Typography variant={'bold_small'}>---- Show Answers {answerCount}</Typography>
      </Button>
      {showAnswers && (
        <ul className={s.commentsList}>
          {data.items.map((answer) => (
            <AnswerItem key={answer.id} comment={answer} />
          ))}
        </ul>
      )}
    </>
  )
}
