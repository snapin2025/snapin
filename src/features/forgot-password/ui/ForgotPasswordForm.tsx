'use client'

import Link from 'next/link'
import { Input, Typography } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { Card } from '@/shared/ui'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useForgotPassword } from '@/features/forgot-password/hooks/use-forgot-password'
import { Recaptcha } from '@/shared/ui/recaptcha'
import { useState } from 'react'

type ForgotPasswordInputs = {
  email: string
}

export const ForgotPasswordForm = () => {
  const [recaptchaToken, setRecaptchaToken] = useState<string>('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ForgotPasswordInputs>({
    defaultValues: { email: '' }
  })

  const { mutate: sendRecoveryEmail, isPending } = useForgotPassword({
    onSuccess: () => {
      console.log('Email отправлен!')
      reset()
      setRecaptchaToken('')
    }
  })
  // const { mutate: sendRecoveryEmail, isPending } = useForgotPassword()
  const onSubmit: SubmitHandler<ForgotPasswordInputs> = (data) => {
    if (!recaptchaToken) {
      alert('Please complete the captcha')
      return
    }

    sendRecoveryEmail({
      // тут все горит красным проблема с типами
      email: data.email,
      recaptcha: recaptchaToken
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

      <Button variant="primary" type={'submit'} className={s.button} disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Link'}
      </Button>

      <Link href="/signin" className={s.backLink}>
        Back to Sign In
      </Link>
      {/*это сама капча */}
      <Recaptcha onVerify={() => setRecaptchaToken('recaptchaValue')} onError={() => setRecaptchaToken('')} />
    </Card>
  )
}
