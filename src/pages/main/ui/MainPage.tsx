'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/shared/lib'
import { Spinner } from '@/shared/ui'

// export function MainPage() {
//   const { user, isLoading, isError } = useAuth()
//   const router = useRouter()
//
//   useEffect(() => {
//     if (isError) {
//       router.replace('/sign-in')
//     }
//   }, [isError, router])
//
//   if (isLoading) return <Spinner />
//   if (!user) return <p>Not logged in</p>
//   return (
//     <div>
//       <h1>Welcome {user.userName}</h1>
//       <p>Email: {user.email}</p>
//     </div>
//   )
// }
export function MainPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuth()
  useEffect(() => {
    const code = searchParams?.get('code')
    const email = searchParams?.get('email')
    if (user) router.replace(`/profile/${user.userId}`)
    else router.replace('/sign-in')
    console.log([code, email])
    if (code && email) {
      // Перенаправляем на страницу подтверждения регистрации
      router.replace(`/confirm?code=${code}&email=${email}`)
    }
  }, [searchParams, router, user])

  if (!isLoading) return <Spinner />
  return <div>Hello{/*Счетчик и 4 поста*/}</div>
}
