'use client'

import Link from 'next/link'
import { Dialog, DialogContent, Input, Typography } from '@/shared/ui'
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
  const [showModal, setShowModal] = useState(false)
  const [savedEmail, setSavedEmail] = useState('') // ← сохраняем email для модалки

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(inputEmailSchema),
    mode: 'onChange',
    defaultValues: { email: '', recaptcha: '' }
  })

  const { mutate: sendRecoveryEmail, isPending } = useForgotPassword()

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = (data) => {
    if (!recaptchaToken) {
      setFormError('Please complete the captcha')
      return
    }

    setFormError('')
    sendRecoveryEmail(
      {
        email: data.email,
        recaptcha: recaptchaToken,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${ROUTES.AUTH.CREATE_NEW_PASSWORD}`
      },
      {
        onSuccess: () => {
          setSavedEmail(data.email) // сохраняем email для модалки
          reset({ email: '', recaptcha: '' })
          recaptchaRef.current?.reset()
          setShowModal(true) // открываем модалку
        },
        onError: (
          err: AxiosError<{
            statusCode: number
            messages: { message: string; field: string }[]
          }>
        ) => {
          const serverMessage = err.response?.data?.messages?.[0]?.message || 'Something went wrong'
          setFormError(serverMessage)
        }
      }
    )
  }

  return (
    <>
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
          {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}
          {formError && !errors.email && <span className={s.errorMessage}>{formError}</span>}
        </div>

        <p className={s.text}>Enter your email address and we will send you further instructions</p>

        <Button
          variant="primary"
          type="submit"
          className={s.button}
          disabled={!isValid || !recaptchaToken || isPending}
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

      {/* Модалка */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent title="Email sent" showCloseButton={true}>
          <p className={s.textModal}>We have sent a link to confirm your email to {savedEmail}</p>
          <Button className={s.buttonModal} onClick={() => setShowModal(false)}>
            Ok
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
