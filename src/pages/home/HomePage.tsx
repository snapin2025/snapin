'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/shared/lib'
import { Spinner } from '@/shared/ui'

export const HomePage = () => {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (user) router.replace(`/profile/${user.userId}`)
    else router.replace('/sign-in')
  }, [isLoading, user, router])

  return <Spinner />
}
