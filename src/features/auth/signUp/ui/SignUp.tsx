import { Card, Checkbox, Github, Google, Input, Typography } from '@/shared/ui'
import s from './SignUp.module.css'
import { Button } from '@/shared/ui/button/Button'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignUpForm, SignUpSchema } from '@/features/auth/signUp/model'
import { SignUpResponse } from '@/features/auth/signUp'
import Link from 'next/link'

type Props = {
  error?: string | null
  isLoading?: boolean
  onSubmit: (data: SignUpForm) => Promise<SignUpResponse>
}

export const SignUp = ({ error, isLoading = false, onSubmit }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isValid }
  } = useForm<SignUpForm>({
    defaultValues: { email: '', password: '', agree: false, confirmPassword: '', userName: '' },
    resolver: zodResolver(SignUpSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange'
  })

  const handleFormSubmit = async (data: SignUpForm) => {
    try {
      const res = await onSubmit(data)

      if (!res) {
        reset()
        return
      }

      if ('statusCode' in res && res.statusCode === 400) {
        res.messages.forEach(({ field, message }) => {
          switch (field) {
            case 'email':
              setError('email', { message: 'User with this email is already registered' })
              break
            case 'userName':
              setError('userName', { message: 'User with this username is already registered' })
              break
            case 'password':
              setError('password', { message: message })
              break
            default:
              setError('root', { message: message || 'Unexpected error' })
          }
        })
        return
      }
      if (res.statusCode === 204) {
        reset()
      }
    } catch (err: unknown) {
      console.error('Unexpected error:', err)
      setError('root', { message: 'Unexpected error occured' })
    }
  }

  return (
    <Card className={s.card} as="form" noValidate onSubmit={handleSubmit(handleFormSubmit)}>
      <h2 className={s.title}>Sign Up</h2>

      <div className={s.containerBtn}>
        <Google />
        <Github />
      </div>

      <div className={s.containerInput}>
        <Input
          label="User name"
          type="text"
          id="Username"
          placeholder="Epam11"
          error={errors.userName?.message}
          {...register('userName')}
          className={s.inputCustom}
        />
      </div>

      <div className={s.containerInput}>
        <Input
          label="Email"
          type="email"
          id="Email"
          placeholder="Epam@epam.com"
          error={errors.email?.message}
          {...register('email')}
          className={s.inputCustom}
        />
      </div>

      <div className={s.containerInput}>
        <Input
          label="Password"
          type="password"
          id="Password"
          placeholder="******************"
          error={errors.password?.message}
          {...register('password')}
          className={s.inputCustom}
        />
      </div>

      <div className={s.containerInput}>
        <Input
          label="Password Сonfirmation"
          type="password"
          id="confirmPassword"
          placeholder="******************"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
          className={s.inputCustom}
        />
      </div>

      <div className={s.containerIAgree}>
        <Controller
          name="agree"
          control={control}
          render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
        />
        <Typography variant="small" className={s.paragraph}>
          I agree to the{' '}
          <Typography variant="small_link" href={'/'} className={s.paragraph}>
            Terms of Service
          </Typography>{' '}
          and{' '}
          <Typography variant="small_link" href={'./'} className={s.paragraph}>
            Privacy Policy
          </Typography>
        </Typography>
      </div>

      {/*{errors.root?.message && <p className={s.rootError}>{errors.root.message}</p>}*/}

      <Button variant={'primary'} type="submit" className={s.buttonFullWidth} disabled={isLoading || !isValid}>
        Sign Up
      </Button>

      <Typography variant="regular_16" className={s.paragraph}>
        Do you have an account?
      </Typography>
      <Link href={'/auth/signin'}>
        <Button variant={'textButton'} disabled={!isValid}>
          Sign In
        </Button>
      </Link>
    </Card>
  )
}
