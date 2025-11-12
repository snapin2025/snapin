'use client'

import Link from 'next/link'
import { Input, Typography } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { Card } from '@/shared/ui'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useForgotPassword } from '@/features/forgot-password/hooks/use-forgot-password'

import { useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordFormSchema, ForgotPasswordFormType } from '@/features/forgot-password/model'
import ReCAPTCHA from 'react-google-recaptcha'
import { Modal } from '@/features/forgot-password/ui/ResendLinkModal'

export const ForgotPasswordForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: '', recaptcha: '' }
  })

  const { mutate: sendRecoveryEmail, isPending } = useForgotPassword()

  const onSubmit: SubmitHandler<ForgotPasswordFormType> = (data) => {
    sendRecoveryEmail(
      {
        email: data.email,
        recaptcha: data.recaptcha
      },
      {
        onSuccess: () => {
          reset({ email: '', recaptcha: '' })
          recaptchaRef.current?.reset()
          setIsModalOpen(true)
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
      <Controller
        control={control}
        name="recaptcha"
        rules={{ required: 'Please confirm you are not a robot' }}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
              onChange={(token) => onChange(token ?? '')}
              onExpired={() => onChange('')}
              theme="dark"
            />
            {(error || errors.recaptcha) && (
              <span className={s.errorMessage}>{error?.message ?? errors.recaptcha?.message}</span>
            )}
          </>
        )}
      />

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} modalTitle="Email sent">
        <p className={s.textModal}>We have sent a link to confirm your email to epam@epam.com</p>
        <Button className={s.buttonModal} onClick={() => setIsModalOpen(false)}>
          Ok
        </Button>
      </Modal>
    </Card>
  )
}
