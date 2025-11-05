import { SubmitHandler, useForm } from 'react-hook-form'
import { Card, Input, Button, Typography } from '@/shared/ui'
import s from './ForgotPasswordForm.module.css'

type CreatePasswordInput = {
  password: string
  password_confirmation: string
}

export const CreateNewPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreatePasswordInput>({
    defaultValues: {
      password: '',
      password_confirmation: ''
    }
  })

  const onSubmit: SubmitHandler<CreatePasswordInput> = (data) => {
    console.log(data)
    reset() // Очищаем форму после сабмита  отправки
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
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            },
            maxLength: {
              value: 20,
              message: 'Password must be no more than 20 characters'
            }
          })}
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
          {...register('password_confirmation', {
            required: 'Please confirm your password',
            validate: (value, formValues) => value === formValues.password || 'The passwords must match'
          })}
        />
        {errors.password_confirmation && <span className={s.errorMessage}>{errors.password_confirmation.message}</span>}
      </div>

      <p className={s.text}>Your password must be between 6 and 20 characters</p>

      <Button variant="primary" className={s.buttonPassword} type="submit">
        Create new password
      </Button>
    </Card>
  )
}
