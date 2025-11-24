'use client'

import Link from 'next/link'
import s from './ForgotPasswordForm.module.css'
import { Button, Card, Input, Typography } from '@/shared/ui'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmailOnlyInputs, emailOnlySchema } from '../model/validateInput'
import { useResendRecoveryEmail } from '../api/useResetPassword'
import { ROUTES } from '@/shared/lib/routes'
import { AxiosError } from 'axios'

type Props = {
  onResendClick?: () => void
}

export const EmailSentMessage = ({ onResendClick }: Props) => {
  const queryClient = useQueryClient()
  const savedEmail = queryClient.getQueryData<string>(['recovery-email']) ?? '' // дефолт, если email не сохранён

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid } // ✔  isValid для дизейбла кнопки
  } = useForm<EmailOnlyInputs>({
    // ✔ Используем готовую схему emailOnlySchema для формы без капчи
    resolver: zodResolver(emailOnlySchema),
    mode: 'onChange', // ✔ Чтобы isValid обновлялся при изменении поля
    defaultValues: {
      email: savedEmail || ''
    }
  })

  const { mutate: resendEmail, isPending } = useResendRecoveryEmail()

  const onSubmit: SubmitHandler<EmailOnlyInputs> = (data) => {
    resendEmail(
      {
        email: data.email,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${ROUTES.AUTH.CREATE_NEW_PASSWORD}`
      },
      {
        onSuccess: () => {
          alert(`We have sent a link to confirm your email to ${savedEmail}`)
          onResendClick?.()
          reset()
        },
        onError: (err: unknown) => {
          const message =
            err instanceof AxiosError
              ? (err.response?.data?.messages?.[0]?.message ?? 'Something went wrong. Please enter your email again.')
              : 'Something went wrong. Please enter your email again.'
          alert(message)
        }
      }
    )
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
          {...register('email')}
        />
        {errors.email?.message && <span className={s.errorMessage}>{errors.email.message}</span>}
      </div>

      <p className={s.text}>Enter your email address and we will send you further instructions</p>

      {/*исправила на это  Это строго соответствует шагу 5 UC-3.*/}
      <p className={s.textLink}>
        The link has been sent by email. If you don’t receive an email send link again {savedEmail}
      </p>

      {/*кнопку для разных состояний*/}
      {/* ✔ UC-3 шаг 4: кнопка дизейблится, если email пустой/невалидный или запрос отправки в процессе */}
      <Button variant="primary" className={s.button} type={'submit'} disabled={!isValid || isPending}>
        {isPending ? 'Sending' : 'Send Link Again'}
      </Button>

      <Link href="/sign-in" className={s.backLink}>
        Back to Sign In
      </Link>
      {/*  форма без капчи*/}
    </Card>
  )
}
