import React from 'react'
import { SignIn } from '@/features/auth/signIn'
import { Card, Typography } from '@/shared/ui'
import { Oauth } from '@/widgets'
import s from './sign-in.module.css'

export const SignInPage = () => {
  return (
    <Card className={s.card}>
      <Typography variant={'h1'} asChild className={s.title}>
        <h1>Sign In</h1>
      </Typography>
      <Oauth />
      <SignIn />
    </Card>
  )
}
