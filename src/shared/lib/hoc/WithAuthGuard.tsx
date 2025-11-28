'use client'

import { useRouter } from 'next/navigation'
import { ComponentType, JSX, useEffect } from 'react'
import { useAuth } from '@/shared/lib'
import { Spinner } from '@/shared/ui'

/**
 * HOC AuthGuard оборачивает приватные страницы
 * Если пользователь не авторизован, редирект на /login
 * Пока данные загружаются — показывается спиннер
 */

export function WithAuthGuard<T extends JSX.IntrinsicAttributes>(Component: ComponentType<T>) {
  return function Guarded(props: T) {
    const { user, isLoading, isError } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && (!user || isError)) {
        router.replace('/sign-in')
      }
    }, [user, isLoading, isError, router])

    if (isLoading) return <Spinner />

    if (!user || isError) return null

    return <Component {...props} />
  }
}
