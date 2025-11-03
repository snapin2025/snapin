'use client'



import { SignIn } from '../../../features/signIn'

export default function SignInPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <SignIn />
    </div>
  )
}
