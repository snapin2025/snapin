'use client'

import { useCreateAnswer } from '../model/useCreateAnswer'
import { CommentForm } from './CommentForm'

type Props = {
  postId: number
  commentId: number
}

export const CreateAnswerForm = ({ postId, commentId }: Props) => {
  const { mutate } = useCreateAnswer()

  const handleSubmit = ({ content }: { content: string }) => {
    mutate({
      postId,
      commentId,
      content
    })
  }

  return <CommentForm onSubmit={handleSubmit} />
}
