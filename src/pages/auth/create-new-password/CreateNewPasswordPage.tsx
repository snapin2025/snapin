// 'use client'
//
// import { useEffect, useState } from 'react'
// import { useSearchParams } from 'next/navigation'
// import { CreateNewPassword, useCheckRecoveryCode } from '@/features/auth/forgot-password'
// import LinkOldPage from '@/features/auth/forgot-password/ui/LinkOldPage'
//
// export const CreateNewPasswordPage = () => {
//   const params = useSearchParams()
//   const recoveryCode = params?.get('code') ?? ''
//   const emailParam = params?.get('email') ?? ''
//
//   const [email, setEmail] = useState('')
//
//   const { mutate, isPending, isError } = useCheckRecoveryCode()
//
//   useEffect(() => {
//     if (!recoveryCode) return
//
//     mutate(
//       { recoveryCode },
//       {
//         onSuccess: (res) => {
//           setEmail(res.email || emailParam)
//         }
//       }
//     )
//   }, [recoveryCode, emailParam, mutate])
//
//   if (isPending) return <p>Loading...</p>
//   if (isError) return <LinkOldPage />
//   if (!email) return null
//
//   return <CreateNewPassword />
// }
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation' // ← ДОБАВИТЬ useRouter
import { CreateNewPassword, useCheckRecoveryCode } from '@/features/auth/forgot-password'
import LinkOldPage from '@/features/auth/forgot-password/ui/LinkOldPage'
import { ROUTES } from '@/shared/lib/routes' // ← ДОБАВИТЬ ROUTES

export const CreateNewPasswordPage = () => {
  const params = useSearchParams()
  const router = useRouter() // ← ДОБАВИТЬ
  const recoveryCode = params?.get('code') ?? ''
  const emailParam = params?.get('email') ?? ''

  const [email, setEmail] = useState('')

  const { mutate, isPending, isError } = useCheckRecoveryCode()

  useEffect(() => {
    if (!recoveryCode) return

    mutate(
      { recoveryCode },
      {
        onSuccess: (res) => {
          setEmail(res.email || emailParam)
        },
        // ← ДОБАВИТЬ обработку ошибки
        onError: (err) => {
          console.log('❌ CHECK RECOVERY CODE ERROR:', err)
          // Редирект на страницу истекшей ссылки при ошибке 400
        }
      }
    )
  }, [recoveryCode, emailParam, mutate, router]) // ← ДОБАВИТЬ router в зависимости

  if (isPending) return <p>Loading...</p>
  if (isError) return <LinkOldPage />
  if (!email) return null

  return <CreateNewPassword />
}
