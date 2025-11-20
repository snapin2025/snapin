'use client'

import Link from 'next/link'
import { Input, Typography } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { Card } from '@/shared/ui'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ForgotPasswordInputs, inputEmailSchema } from '@/features/auth/forgot-password/model/validateInput'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForgotPassword } from '@/features/auth/forgot-password/api/useForgotPassword'
import { AxiosError } from 'axios'
import { ROUTES } from '@/shared/lib/routes'

export const ForgotPasswordForm = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string>('')
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  const [formError, setFormError] = useState<string>('')
  // ✔ ИСПРАВЛЕНО: состояние ошибки сервера для отображения под полем email

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid }
    // ✔ ИСПРАВЛЕНО: добавлено isValid → кнопка становится disabled как в UC-3 шаг 4
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(inputEmailSchema),
    mode: 'onChange',
    // ✔ ИСПРАВЛЕНО: включили onChange, чтобы isValid обновлялся при вводе
    defaultValues: { email: '', recaptcha: '' }
  })

  const { mutate: sendRecoveryEmail, isPending } = useForgotPassword()

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = (data) => {
    if (!recaptchaToken) {
      setFormError('Please complete the captcha')
      return
    }

    setFormError('')
    // ✔ ИСПРАВЛЕНО: сбрасываем старую ошибку перед новым запросом

    sendRecoveryEmail(
      {
        email: data.email,
        recaptcha: recaptchaToken,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${ROUTES.AUTH.CREATE_NEW_PASSWORD}`
      },
      {
        onSuccess: () => {
          reset({ email: '', recaptcha: '' })
          recaptchaRef.current?.reset()
        },
        onError: (
          err: AxiosError<{
            statusCode: number
            messages: { message: string; field: string }[]
          }>
        ) => {
          // ✔ ИСПРАВЛЕНО: строго по Swagger UC-3 — ошибки приходят в массиве messages[]
          const serverMessage = err.response?.data?.messages?.[0]?.message || 'Something went wrong'

          setFormError(serverMessage)
        }

        // ПОЧЕМУ ИСПРАВИЛИ:
        // ❗ Swagger UC-3 возвращает форму:
        // {
        //   statusCode: 400,
        //   messages: [{ message: "User not found", field: "email" }]
        // }
        // Поэтому нельзя использовать err.response.data.message
        // Нужно брать messages[0].message → иначе TypeScript ругался.
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

        {/* ✔ Сообщение Zod валидации */}
        {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}

        {/* ✔ Сообщение от сервера → email не найден */}
        {formError && !errors.email && <span className={s.errorMessage}>{formError}</span>}
      </div>

      <p className={s.text}>Enter your email address and we will send you further instructions</p>

      <Button
        variant="primary"
        type="submit"
        className={s.button}
        disabled={!isValid || !recaptchaToken || isPending}
        // ✔ UC-3: кнопка заблокирована если форма невалидна, капча пустая или идёт запрос
      >
        {isPending ? 'Sending' : 'Send Link'}
      </Button>

      <Link href={ROUTES.AUTH.SIGN_IN} className={s.backLink}>
        Back to Sign In
      </Link>

      <div className={s.captchaContainer}>
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
