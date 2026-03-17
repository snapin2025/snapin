'use client'

import { Input } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import s from './CommentForm.module.css'
import { CommentSchema } from '@/entities/posts/model/validation'

type FormValues = {
  content: string
}

type Props = {
  onSubmit: (data: FormValues) => void
}

export const CommentForm = ({ onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<FormValues>({
    resolver: zodResolver(CommentSchema),
    mode: 'onChange'
  })

  const submitHandler = (data: FormValues) => {
    onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className={s.container}>
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
