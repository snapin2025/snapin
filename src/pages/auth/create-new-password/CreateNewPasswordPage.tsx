// 'use client'
//
// import { useEffect, useState } from 'react'
// import { useSearchParams } from 'next/navigation'
// import { CreateNewPassword } from '@/features/auth/forgot-password'
// import { useCheckRecoveryCode } from '@/features/auth/forgot-password'
// import LinkOldPage from '@/features/auth/forgot-password/ui/LinkOldPage'
//
// export const CreateNewPasswordPage = () => {
//   const params = useSearchParams()
//   const recoveryCode = params?.get('code') ?? ''
//   const emailParam = params?.get('email') ?? ''
//
//   const [email, setEmail] = useState<string>('')
//   const [validCodeMap, setValidCodeMap] = useState<Record<string, boolean>>({}) // хранит результат проверки для каждого кода
//
//   const { mutate: checkRecoveryCode, isPending } = useCheckRecoveryCode()
//
//   useEffect(() => {
//     if (!recoveryCode) return
//
//     checkRecoveryCode(
//       { recoveryCode },
//       {
//         onSuccess: (res) => {
//           setEmail(res.email || emailParam)
//           setValidCodeMap((prev) => ({ ...prev, [recoveryCode]: true }))
//         },
//         onError: () => {
//           setValidCodeMap((prev) => ({ ...prev, [recoveryCode]: false }))
//         }
//       }
//     )
//   }, [checkRecoveryCode, recoveryCode, emailParam])
//
//   if (isPending) return <p>Loading...</p>
//
//   const isValidCode = validCodeMap[recoveryCode]
//
//   if (isValidCode === true && email) return <CreateNewPassword email={email} />
//   if (isValidCode === false) return <LinkOldPage />
//
//   return null
// }
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CreateNewPassword, useCheckRecoveryCode } from '@/features/auth/forgot-password'
import LinkOldPage from '@/features/auth/forgot-password/ui/LinkOldPage'

export const CreateNewPasswordPage = () => {
  const params = useSearchParams()
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
        }
      }
    )
  }, [recoveryCode, emailParam, mutate])

  if (isPending) return <p>Loading...</p>
  if (isError) return <LinkOldPage />
  if (!email) return null

  return <CreateNewPassword email={email} />
}
