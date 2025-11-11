'use client'

import Link from 'next/link'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { Card, Input, Typography } from '@/shared/ui'
import { useResendRecoveryEmail } from '../hooks/use-reset-password'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'

type ForgotPasswordInputs = {
  email: string
}

type Props = {
  onResendClick?: () => void
}

export const EmailSentMessage = ({ onResendClick }: Props) => {
  const queryClient = useQueryClient() // ← ДОБАВИТЬ
  const savedEmail = queryClient.getQueryData<string>(['recovery-email'])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ForgotPasswordInputs>({
    // defaultValues: { email: '' }
    defaultValues: {
      email: savedEmail || ''
    }
  })

  const { mutate: resendEmail, isPending } = useResendRecoveryEmail()

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = (data) => {
    resendEmail(data.email, {
      onSuccess: () => {
        console.log('Письмо отправлено повторно!')
        onResendClick?.() // ← показываем модалку
        reset()
      }
    })
  }

  return (
    <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h1">Forgot Password</Typography>
      <div className={s.field}>
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="Epam@epam.com"
          error={!!errors.email}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}
      </div>

      <p className={s.text}>Enter your email address and we will send you further instructions</p>

      <p className={s.textLink}>The link has been sent by email. If you don&apos;t receive an email send link again</p>

      {/*изменим обшую кнопку для разных состояний*/}
      <Button variant="primary" className={s.button} type={'submit'} disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Link Again'}
      </Button>

      <Link href="/signin" className={s.backLink}>
        Back to Sign In
      </Link>

      {/* форма ❌ БЕЗ капчи */}
    </Card>
  )
}

//хардкодированный email 'vikcoding24@gmail.com'
