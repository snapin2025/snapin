import React from 'react'
import { Oauth } from '@/widgets/oauth'
import { Card } from '@/shared/ui'

export const SignIn = () => {
  return (
    <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ width: '32rem', display: 'flex', alignItems: 'center' }}>
        <Oauth></Oauth>
      </Card>
    </section>
  )
}
