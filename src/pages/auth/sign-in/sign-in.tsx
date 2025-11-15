'use client'

import React from 'react'
import { SignIn } from '@/features/auth/signIn'
import s from './sign-in.module.css'
import { Oauth } from '@/widgets/oauth'
import { Card, Typography } from '@/shared/ui'
import { WithGuestGuard } from '@/shared/lib/hoc/WithGuestGuard'

const SignInP = () => {
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

export const SignInPage = WithGuestGuard(SignInP)
