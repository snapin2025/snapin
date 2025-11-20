'use client'

import Link from 'next/link'
import { BaseModal, Card, Input, Typography } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { AxiosError } from 'axios'
import { ROUTES } from '@/shared/lib/routes'
import { ForgotPasswordInputs, inputEmailSchema } from '../model/validateInput'
import { useForgotPassword } from '../api/useForgotPassword'
import { useQueryClient } from '@tanstack/react-query'

export const ForgotPasswordForm = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string>('')
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)
  // ✔ Добавлено состояние для отображения ошибки сервера (не зарегистрированный email)
  const [formError, setFormError] = useState<string>('')
  const [showModal, setShowModal] = useState(false) // ← ДОБАВИЛ состояние для модалки
  const savedEmail = useQueryClient().getQueryData<string>(['recovery-email']) ?? ''
  const {
    register,
    reset,
    handleSubmit,

    formState: { errors, isValid } // ✔ Добавлено isValid для дизейбла кнопки
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(inputEmailSchema),
    mode: 'onChange', // ✔ Включаем onChange чтобы isValid обновлялся при вводе
    defaultValues: { email: '', recaptcha: '' }
  })

  const { mutate: sendRecoveryEmail, isPending } = useForgotPassword()

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = (data) => {
    if (!recaptchaToken) {
      // ✔ Вместо alert можно оставить formError, чтобы отображалось на форме
      setFormError('Please complete the captcha')
      return
    }
    // ✔ Сбрасываем предыдущую ошибку перед новым запросом
    setFormError('')
    sendRecoveryEmail(
      {
        email: data.email,
        recaptcha: recaptchaToken,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${ROUTES.AUTH.CREATE_NEW_PASSWORD}`
      },
      {
        onSuccess: () => {
          reset({ email: '', recaptcha: '' })
          setShowModal(true)
          recaptchaRef.current?.reset()
        },
        onError: (err: AxiosError<{ message: string }>) => {
          const serverMessage = err.response?.data?.message || err.message || 'Something went wrong'
          setFormError(serverMessage)
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
        {/* ✔ Inline сообщение об ошибке от валидации zod */}
        {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}
        {/* ✔ Inline сообщение от сервера (не зарегистрированный email) */}
        {formError && !errors.email && <span className={s.errorMessage}>{formError}</span>}
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
      <BaseModal open={showModal} onOpenChange={setShowModal} title={'Email sent'} showCloseButton={true}>
        <p className={s.textModal}>We have sent a link to confirm your email to {savedEmail}</p>
        <Button onClick={() => setShowModal(false)}>OK</Button>
      </BaseModal>
    </Card>
  )
}
