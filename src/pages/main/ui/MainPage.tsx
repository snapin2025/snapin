'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/shared/lib'
import { Spinner } from '@/shared/ui'

export function MainPage() {
  const { user, isLoading, isError } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isError) {
      router.replace('/sign-in')
    }
  }, [isError, router])

  if (isLoading) return <Spinner />
  if (!user) return <p>Not logged in</p>
  return (
    <div>
      <h1>Welcome {user.userName}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
