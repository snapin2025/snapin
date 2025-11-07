'use client'

import { Card, Github, Google, Input, Typography } from '@/shared/ui'
import Link from 'next/link'
import { Button } from '@/shared/ui/button/Button'
import s from './signIn.module.css'
import { useSignInForm } from '@/features/auth/signIn'

export const SignIn = () => {
  const { register, errors, isPending, onSubmit } = useSignInForm()

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
      <form onSubmit={onSubmit} className={s.form}>
        <div className={s.fieldsWrapper}>
          <Input
            label={'Email'}
            id={'email'}
            placeholder={'Epam@epam.com'}
            type={'email'}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label={'Password'}
            id={'password'}
            placeholder={'**********'}
            type={'password'}
            error={errors.password?.message}
            {...register('password')}
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
