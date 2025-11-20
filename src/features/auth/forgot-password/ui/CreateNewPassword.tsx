'use client'

import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, Input, Button, Typography } from '@/shared/ui'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSetNewPassword } from '../api/useNewPassword'
import { useCheckRecoveryCode } from '../api/useCheckRecoveryCode'
import { CreatePasswordInput, passwordSchema } from '../model/validatePassword'
import s from './ForgotPasswordForm.module.css'
import { ROUTES } from '@/shared/lib/routes'
import { useState } from 'react'
import { AxiosError } from 'axios'

export const CreateNewPassword = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recoveryCode = searchParams?.get('code') || ''

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreatePasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', password_confirmation: '' }
  })

  const { mutate: setNewPassword, isPending } = useSetNewPassword()
  const { mutate: checkRecoveryCode } = useCheckRecoveryCode()

  const [errorMessage, setErrorMessage] = useState('')

  const onSubmit: SubmitHandler<CreatePasswordInput> = (data) => {
    if (!recoveryCode) {
      setErrorMessage('Recovery code not found in URL')
      return
    }

    setErrorMessage('')

    // Простая проверка кода перед установкой пароля
    checkRecoveryCode(
      { recoveryCode },
      {
        onSuccess: () => {
          setNewPassword(
            { newPassword: data.password, recoveryCode },
            {
              onSuccess: () => {
                reset()
                router.push(ROUTES.AUTH.SIGN_IN)
              },
              onError: () => setErrorMessage('Failed to set new password')
            }
          )
        },
        onError: (err: AxiosError<{ messages?: { message: string }[] }>) => {
          setErrorMessage(err.response?.data?.messages?.[0]?.message || 'Invalid or expired code')
        }
      }
    )
  }

  return (
    <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h1">Create New Password</Typography>

      <div className={s.field}>
        <Input
          id="password"
          label="New password"
          type="password"
          placeholder="******************"
          error={!!errors.password}
          {...register('password')}
        />
        {errors.password && <span className={s.errorMessage}>{errors.password.message}</span>}
      </div>

      <div className={s.field}>
        <Input
          id="password_confirmation"
          label="Password confirmation"
          type="password"
          placeholder="******************"
          error={!!errors.password_confirmation}
          {...register('password_confirmation')}
        />
        {errors.password_confirmation && <span className={s.errorMessage}>{errors.password_confirmation.message}</span>}
      </div>

      {errorMessage && <span className={s.errorMessage}>{errorMessage}</span>}

      <p className={s.text}>Your password must be between 6 and 20 characters</p>

      <Button variant="primary" className={s.buttonPassword} type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create new password'}
      </Button>
    </Card>
  )
}
