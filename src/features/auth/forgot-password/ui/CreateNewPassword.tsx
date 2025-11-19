'use client'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, Input, Button, Typography } from '@/shared/ui'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useSetNewPassword } from '../api/useNewPassword'
import { CreatePasswordInput, passwordSchema } from '../model/validatePassword'
import s from './ForgotPasswordForm.module.css'
import { ROUTES } from '@/shared/lib/routes'

export const CreateNewPassword = () => {
  const router = useRouter() // ← создаём router
  const searchParams = useSearchParams() // ← ДОБАВЛЕНО: получаем параметры из URL
  const recoveryCode = searchParams?.get('code') || '' // ← ДОБАВЛЕНО: реальный код из ссылки письма

  // const recoveryCode = 'test-recovery-code' // ← временный хардкод для разработки можно для тестирования

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
    if (!recoveryCode) {
      console.error('Recovery code not found in URL') // ← проверка, если код не пришёл
      return
    }
    setNewPassword(
      {
        newPassword: data.password,
        recoveryCode: recoveryCode // ← ИСПОЛЬЗОВАТЬ реальный код из URL
      },
      {
        onSuccess: () => {
          // console.log('/sign-in')
          router.push(ROUTES.AUTH.SIGN_IN) // ← РЕДИРЕКТ ПО ТЗ ШАГ 12
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
        {isPending ? 'Creating' : 'Create new password'}
      </Button>
    </Card>
  )
}
