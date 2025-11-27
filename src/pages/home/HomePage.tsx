'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/shared/lib'
import { Spinner } from '@/shared/ui'

export const HomePage = () => {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (user) {
      router.replace(`/profile/${user.userId}`)
      return
    }

    router.replace('/sign-in')
  }, [user, isLoading, router])

  if (isLoading) return <Spinner />

  return null
}
