'use client'

import {Input, Typography } from '@/shared/ui'
import Link from 'next/link'
import { Button } from '@/shared/ui/button/Button'
import s from './signIn.module.css'
import { useSignInForm } from '@/features/auth/signIn'


export const SignIn = () => {
  const { register, errors, isPending, onSubmit } = useSignInForm()

  return (
    <div className={s.card}>
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
          <Link href={'/forgotPassword'}>Forgot Password</Link>
        </Typography>

        <Button disabled={isPending}>Sign In</Button>
      </form>
      <div className={s.registration}>
        <Typography asChild variant={'regular_14'}>
          <h2>Don’t have an account?</h2>
        </Typography>

        <Typography className={s.registrationLink} asChild variant={'h3'}>
          <Link href={'/signUp'}>Sign Up</Link>
        </Typography>
      </div>
    </div>
  )
}
