'use client'

import React from 'react'
import { Oauth } from '@/widgets/oauth'
import { Card } from '@/shared/ui'
import { WithGuestGuard } from '@/shared/lib/hoc/WithGuestGuard'

const Page = () => {
  return (
    <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: '32rem', display: 'flex', alignItems: 'center' }}>
        <Oauth></Oauth>
      </Card>
    </section>
  )
}

export const SignIn = WithGuestGuard(Page)
