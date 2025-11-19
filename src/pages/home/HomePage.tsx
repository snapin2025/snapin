'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/shared/lib'
import { Spinner } from '@/shared/ui'

export const HomePage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams?.get('code')
  const email = searchParams?.get('email')
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // Пока user загружается — редиректы не делаем
    if (isLoading) return

    // 1) Если есть code + email — переход по ссылке из письма
    if (code && email) {
      router.replace(`/confirm?code=${code}&email=${email}`)
      return
    }

    // 2) Если пользователь уже авторизован
    if (user) {
      router.replace(`/profile/${user.userId}`)
      return
    }

    // 3) Иначе на sign-in
    router.replace('/sign-in')
  }, [code, email, user, isLoading, router])

  // Пока идёт загрузка user или редирект — показываем Spinner
  if (isLoading) return <Spinner />

  return null
}
