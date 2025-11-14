'use client'

import { ComponentType, JSX, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/lib'
import { Spinner } from '@/shared/ui'

/**
 * WithGuestGuard оборачивает публичные страницы (login, register)
 * Если пользователь авторизован, редиректит на приватную страницу
 */

export function WithGuestGuard<T extends JSX.IntrinsicAttributes>(Component: ComponentType<T>) {
  return function Guarded(props: T) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && user) {
        router.replace(`/profile/${user.userId}`)
      }
    }, [user, isLoading, router])

    if (isLoading) return <Spinner />
    if (user) return null

    return <Component {...props} />
  }
}
