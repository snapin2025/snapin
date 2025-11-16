'use client'

import Link from 'next/link'
import { Input, Typography } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { Card } from '@/shared/ui'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { inputEmailSchema } from '@/features/auth/forgot-password/model/validateInput'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForgotPassword } from '@/features/auth/forgot-password/hooks/use-forgot-password'
import { Modal } from '@/features/auth/forgot-password/ui/ResendLinkModal'

export type ForgotPasswordInputs = {
  email: string
  recaptcha: string
}

export const ForgotPasswordForm = () => {
  const [showModal, setShowModal] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string>('')

  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(inputEmailSchema),
    defaultValues: { email: '', recaptcha: '' }
  })

  const { mutate: sendRecoveryEmail, isPending } = useForgotPassword()

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = (data) => {
    if (!recaptchaToken) {
      alert('Please complete the captcha')
      return
    }
    sendRecoveryEmail(
      {
        email: data.email,
        recaptcha: recaptchaToken
      },
      {
        onSuccess: () => {
          reset({ email: '', recaptcha: '' })
          recaptchaRef.current?.reset()
          setShowModal(true)
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
        {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}
      </div>
      <p className={s.text}>Enter your email address and we will send you further instructions</p>
      <Button variant="primary" type={'submit'} className={s.button} disabled={isPending}>
        {isPending ? 'Sending' : 'Send Link'}
      </Button>
      <Link href="auth/signin" className={s.backLink}>
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
      <Modal modalTitle={'Email sent'} open={showModal} onClose={() => setShowModal(false)}>
        <p className={s.textModal}>We have sent a link to confirm your email to epam@epam.com</p>
        <Button className={s.buttonModal} onClick={() => setShowModal(false)}>
          Ok
        </Button>
      </Modal>
    </Card>
  )
}
