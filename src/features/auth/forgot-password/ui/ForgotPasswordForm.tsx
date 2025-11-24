'use client'

import Link from 'next/link'
import { Card, Input, Spinner, Typography } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { AxiosError } from 'axios'
import { ROUTES } from '@/shared/lib/routes'
import { ForgotPasswordInputs, EmailSchema } from '../model/validateEmail'
import { useForgotPassword } from '../api/useForgotPassword'
import { useResendRecoveryEmail } from '../api/useResendRecoveryEmail'
import { clsx } from 'clsx'

export const ForgotPasswordForm = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)
  const [isCaptchaPassed, setIsCaptchaPassed] = useState<boolean>(false)

  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isValid } // ✔ Добавлено isValid для дизейбла кнопки
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(EmailSchema),
    mode: 'onChange', // ✔ Включаем onChange чтобы isValid обновлялся при вводе
    defaultValues: { email: '' }
  })

  const { mutate: sendRecoveryLink, isPending: isSending } = useForgotPassword()

  const { mutate: resendRecoveryLink, isPending: isResending } = useResendRecoveryEmail()

  const sendRecoveryLinkHandler = (data: ForgotPasswordInputs) => {
    if (!recaptchaToken) return
    // ✔ Сбрасываем предыдущую ошибку перед новым запросом
    sendRecoveryLink(
      {
        email: data.email,
        recaptcha: recaptchaToken,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.AUTH.CREATE_NEW_PASSWORD}`
      },
      {
        onSuccess: () => {
          reset({ email: '' })
          alert(`We have sent a link to confirm your email to ${data.email}`)
          setIsCaptchaPassed(true)
        },
        onError: (
          err: AxiosError<{
            statusCode: number
            messages: { message: string; field: string }[]
          }>
        ) => {
          const serverMessage = err.response?.data?.messages?.[0]?.message || 'Something went wrong'
          setError('email', { type: 'server error', message: serverMessage })
          recaptchaRef.current?.reset()
          setRecaptchaToken(null)
        }
      }
    )
  }

  const resendRecoveryLinkHandler = (data: ForgotPasswordInputs) => {
    resendRecoveryLink(
      {
        email: data.email,
        //  передаём baseUrl, как требует backend
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.AUTH.CREATE_NEW_PASSWORD}`
      },
      {
        onSuccess: () => {
          console.log('Письмо отправлено повторно!')
          reset()
        },
        onError: (
          err: AxiosError<{
            statusCode: number
            messages: { message: string; field: string }[]
          }>
        ) => {
          const serverMessage = err.response?.data?.messages?.[0]?.message || 'Something went wrong'
          setError('email', { type: 'server error', message: serverMessage })
          recaptchaRef.current?.reset()
          setRecaptchaToken(null)
        }
      }
    )
  }

  const onSubmitHandler: SubmitHandler<ForgotPasswordInputs> = (data) => {
    if (isCaptchaPassed) {
      resendRecoveryLinkHandler(data)
    } else sendRecoveryLinkHandler(data)
  }

  return (
    <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmitHandler)}>
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
        {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}
      </div>
      <p className={s.text}>Enter your email address and we will send you further instructions</p>
      {/* ✔ Кнопка теперь дизейблится, если форма не валидна или капча не пройдена */}
      {isCaptchaPassed ? (
        <>
          <p className={s.textLink}>
            The link has been sent by email. <br /> If you don&#39;t receive an email send link again
          </p>
          <Button variant="primary" className={s.button} type={'submit'} disabled={!isValid || isSending}>
            {isResending ? <Spinner inline /> : 'Send Link Again'}
          </Button>
        </>
      ) : (
        <Button
          variant="primary"
          type={'submit'}
          className={s.button}
          disabled={!isValid || !recaptchaToken || isResending} // ✔ UC-3: шаг 4
        >
          {isSending ? <Spinner inline /> : ' Send Link'}
        </Button>
      )}
      <Link href={ROUTES.AUTH.SIGN_IN} className={s.backLink}>
        Back to Sign In
      </Link>
      <div className={s.captchaContainer}>
        {/*это сама капча  гугла  */}

        <ReCAPTCHA
          className={clsx(s.captchaContainer, isCaptchaPassed && s.isVisible)}
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={(token) => {
            setRecaptchaToken(token)
          }}
          onExpired={() => {
            setRecaptchaToken(null)
            setIsCaptchaPassed(false)
            recaptchaRef.current?.reset()
          }}
          theme="dark"
          hl="en"
        />
      </div>
    </Card>
  )
}
