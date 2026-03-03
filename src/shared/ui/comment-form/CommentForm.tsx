//2
'use client'

import { Input } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CommentSchema } from '@/features/posts/post-comments/model/validation'
import { useCreateComment } from '@/features/posts/post-comments/model/useCreateComment'
import type { CreateCommentParams, CreateCommentResponse } from '@/features/posts/post-comments/model/types'
import s from './CommentForm.module.css'

type CommentFormProps = {
  postId: number
  onSuccess?: (comment: CreateCommentResponse) => void
}

// ✅ Используем Pick для типа формы
type FormValues = Pick<CreateCommentParams, 'content'>

export const CommentForm = ({ postId, onSuccess }: CommentFormProps) => {
  const { mutate } = useCreateComment()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<FormValues>({
    resolver: zodResolver(CommentSchema),
    mode: 'onChange'
  })

  const onSubmit = (data: FormValues) => {
    mutate(
      { postId, content: data.content },
      {
        onSuccess: (commentData) => {
          reset() // очистка формы
          if (onSuccess) {
            // проверяем: передал ли родитель функцию?
            // если да - вызываем её с данными комментария
            onSuccess(commentData)
          }
        }
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.container}>
      <div className={s.fieldcoment}>
        <Input
          id="comment"
          type="text"
          placeholder="Add a comment..."
          className={s.inputcoment}
          error={!!errors.content}
          {...register('content')}
        />
        {errors.content && <span className={s.errorMessage}>{errors.content.message}</span>}
      </div>
      <Button variant="textButton" className={s.buttoncoment} disabled={!isValid} type="submit">
        Publish
      </Button>
    </form>
  )
}
// переиспользуется в  вдругом месте feed
