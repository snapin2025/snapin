'use client'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, Input, Button, Typography } from '@/shared/ui'
import s from './ForgotPasswordForm.module.css'
import { useSetNewPassword } from '@/features/forgot-password/hooks/use-reset-password'
import { passwordSchema, type CreatePasswordInput } from '../model'

export const CreateNewPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreatePasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      password_confirmation: ''
    }
  })

  const { mutate: setNewPassword, isPending } = useSetNewPassword()

  const onSubmit: SubmitHandler<CreatePasswordInput> = (data) => {
    setNewPassword(
      {
        newPassword: data.password,
        recoveryCode: 'mock-recovery-code'
      },
      {
        onSuccess: () => {
          console.log('Пароль успешно изменен!')
          reset()
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

      <p className={s.text}>Your password must be between 6 and 20 characters</p>

      <Button variant="primary" className={s.buttonPassword} type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create new password'}
      </Button>
    </Card>
  )
}
