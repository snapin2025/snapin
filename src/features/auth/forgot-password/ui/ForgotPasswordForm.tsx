'use client'

import Link from 'next/link'
import { Card, Input, Typography } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { AxiosError } from 'axios'
import { ROUTES } from '@/shared/lib/routes'
import { useQueryClient } from '@tanstack/react-query'
import { ForgotPasswordInputs, inputEmailSchema } from '../model/validateInput'
import { useForgotPassword } from '../api/useForgotPassword'

export const ForgotPasswordForm = () => {
  const queryClient = useQueryClient() // <- вот здесь получаем
  const [recaptchaToken, setRecaptchaToken] = useState<string>('')
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)
  // const savedEmail = useQueryClient().getQueryData<string>(['recovery-email']) ?? ''
  // const router = useRouter()
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isValid } // ✔ Добавлено isValid для дизейбла кнопки
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(inputEmailSchema),
    mode: 'onChange', // ✔ Включаем onChange чтобы isValid обновлялся при вводе
    defaultValues: { email: '', recaptcha: '' }
  })

  const { mutate: sendRecoveryEmail, isPending } = useForgotPassword()

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = (data) => {
    if (!recaptchaToken) return
    // ✔ Сбрасываем предыдущую ошибку перед новым запросом

    sendRecoveryEmail(
      {
        email: data.email,
        recaptcha: recaptchaToken,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${ROUTES.AUTH.CREATE_NEW_PASSWORD}`
      },
      {
        onSuccess: () => {
          //дописала
          // Сохраняем email в queryClient
          queryClient.setQueryData(['recovery-email'], data.email) // сохраняем email
          reset({ email: '', recaptcha: '' })
          recaptchaRef.current?.reset()
          // было -так делать не льзя так как Проблема: при первом запросе savedEmail может быть пустым.
          // alert(`We have sent a link to confirm your email to ${savedEmail}`)

          alert(`We have sent a link to confirm your email to ${data.email}`)
          // router.replace(ROUTES.AUTH.RESEND_NEW_PASSWORD_LINK)
        },
        onError: (
          err: AxiosError<{
            statusCode: number
            messages: { message: string; field: string }[]
          }>
        ) => {
          const serverMessage = err.response?.data?.messages?.[0]?.message || 'Something went wrong'
          setError('email', { type: 'server error', message: serverMessage })
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
        {/*С этим исправлением показываются и ошибки валидации, и ошибки от сервера.*/}
        {errors.email?.message && <span className={s.errorMessage}>{errors.email.message}</span>}
      </div>
      <p className={s.text}>Enter your email address and we will send you further instructions</p>
      {/* ✔ Кнопка теперь дизейблится, если форма не валидна или капча не пройдена */}
      <Button
        variant="primary"
        type={'submit'}
        className={s.button}
        disabled={!isValid || !recaptchaToken || isPending} // ✔ UC-3: шаг 4
      >
        {isPending ? 'Sending' : 'Send Link'}
      </Button>
      <Link href={ROUTES.AUTH.SIGN_IN} className={s.backLink}>
        Back to Sign In
      </Link>
      <div className={s.captchaContainer}>
        {/*это сама капча  гугла  */}
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <ReCAPTCHA
            className={s.captchaContainer}
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={(token) => setRecaptchaToken(token ?? '')}
            onExpired={() => setRecaptchaToken('')}
            theme="dark"
            hl="en"
          />
        )}
      </div>
    </Card>
  )
}
