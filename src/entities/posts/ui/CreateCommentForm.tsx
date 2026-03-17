'use client'

import { useCreateComment } from '../model/useCreateComment'
import { CommentForm } from './CommentForm'

type Props = {
  postId: number
}

export const CreateCommentForm = ({ postId }: Props) => {
  const { mutate } = useCreateComment()

  const handleSubmit = ({ content }: { content: string }) => {
    mutate({
      postId,
      content
    })
  }

  return <CommentForm onSubmit={handleSubmit} />
}
