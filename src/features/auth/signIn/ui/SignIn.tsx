'use client'

import { useForm } from 'react-hook-form'
import { Card, Github, Google, Input, Typography } from '@/shared/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/button/Button'
import s from './signIn.module.css'

import { zodResolver } from '@hookform/resolvers/zod'

import { SignInForm, signInSchema } from '@/features/auth/signIn/model'
import { getMe, SignInRequest, useSignIn } from '@/features/auth/signIn'
export const SignIn = () => {
  const {
    register,
    setValue,
    clearErrors,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit',

    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { mutateAsync, isPending } = useSignIn()
  const router = useRouter()

  const onSubmit = async (data: SignInForm) => {
    const payload: SignInRequest = { email: data.email, password: data.password }
    try {
      const res = await mutateAsync(payload)
      if (typeof window !== 'undefined' && res?.accessToken) {
        localStorage.setItem('accessToken', res.accessToken)
      }
      const me = await getMe()
      if (me?.userId) {
        router.push(`/profile/${me.userId}`)
      }
    } catch (e) {
      const error = e as { response?: { data?: { messages?: string } } }
      const message = error?.response?.data?.messages || 'Authentication failed'
      setError('password', { type: 'server', message })
    }
  }

  return (
    <Card className={s.card}>
      <Typography variant={'h1'} asChild className={s.title}>
        <h1>Sign In</h1>
      </Typography>
      <div className={s.oAuth}>
        <Link href={'google.com'}>
          <Google name={'google'} width={'36px'} height={'36px'} />
        </Link>
        <Link href={'github.com'}>
          <Github name={'github'} width={'36px'} height={'36px'} />
        </Link>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div className={s.fieldsWrapper}>
          <Input
            label={'Email'}
            id={'email'}
            placeholder={'Epam@epam.com'}
            type={'email'}
            error={errors.email?.message}
            {...register('email')}
            onChange={(e) => {
              setValue('email', e.target.value)
              clearErrors('email')
            }}
          />

          <Input
            label={'Password'}
            id={'password'}
            placeholder={'**********'}
            type={'password'}
            error={errors.password?.message}
            {...register('password')}
            onChange={(e) => {
              setValue('password', e.target.value)
              clearErrors('password')
            }}
          />
        </div>
        <Typography asChild className={s.forgotPasswordLink} variant={'regular_link'}>
          <Link href={'/auth/forgotPassword'}>Forgot Password</Link>
        </Typography>

        <Button disabled={isPending}>Sign In</Button>
      </form>
      <div className={s.registration}>
        <Typography asChild className={s.registration} variant={'regular_14'}>
          <h2>Don’t have an account?</h2>
        </Typography>
        <Link href={'/auth/signUp'}>
          <Button variant={'textButton'}>Sign Up</Button>
        </Link>
      </div>
    </Card>
  )
}
