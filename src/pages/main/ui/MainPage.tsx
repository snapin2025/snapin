'use client'

import { useAuth } from '@/shared/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function MainPage() {
  const { user, isLoading, isError } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isError) {
      router.replace('/sign-in')
    }
  }, [isError, router])

  if (isLoading) return <p>Loading...</p>
  if (!user) return <p>Not logged in</p>
  return (
    <div>
      <h1>Welcome {user.userName}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
