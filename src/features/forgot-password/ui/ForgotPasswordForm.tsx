'use client'

import Link from 'next/link'
import { Captch, Checkbox, Input, Typography } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { Card } from '@/shared/ui'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useForgotPassword } from '@/features/forgot-password/hooks/use-forgot-password'

type ForgotPasswordInputs = {
  email: string
}

export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ForgotPasswordInputs>({
    defaultValues: { email: '' }
  })

  const { mutate: sendRecoveryEmail, isPending } = useForgotPassword() // ХУК

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = (data) => {
    sendRecoveryEmail(data.email, {
      onSuccess: () => {
        console.log('Email отправлен!')
        reset()
      }
    })
  }

  return (
    <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h1">Forgot Password</Typography>

      {/* Email поле */}
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

      {/* Кнопка отправки */}
      <Button variant="primary" type={'submit'} className={s.button} disabled={isPending}>
        {isPending ? 'Sending...' : 'Send Link'} {/* ← Меняем текст при загрузке */}
      </Button>

      {/* Ссылка назад */}
      <Link href="/signin" className={s.backLink}>
        Back to Sign In
      </Link>

      {/* Капча с полной структурой */}
      <div className={s.captchaContainer}>
        {/* Чекбокс слева */}
        <label className={s.captchaLabel}>
          <Checkbox name="captcha" className={s.captchaCheckbox} />
          <span className={s.checkboxText}>I&apos;m not a robot</span>
        </label>

        {/* Капча справа с иконкой и текстом */}
        <div className={s.captchaLogo}>
          <Captch />
          <div className={s.captchaTextWrapper}>
            <span className={s.captchaLine1}>reCAPTCHA</span>
            <span className={s.captchaLine2}>Privacy-Terms</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
