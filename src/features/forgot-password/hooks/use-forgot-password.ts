// 'use client'
//
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { sendRecoveryEmail } from '../api'
//
// export const useForgotPassword = () => {
//   const queryClient = useQueryClient()
//
//   return useMutation({
//     mutationFn: sendRecoveryEmail
//     // onSuccess: (data, variables) => {
//     //   queryClient.setQueryData(['recovery-email'], variables)
//     // }
//   })
// }

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendRecoveryEmail } from '../api'
import type { ForgotPasswordInputs } from '@/features/forgot-password/model/validateInput'

export const useForgotPassword = () => {
  const queryClient = useQueryClient()

  return useMutation<
    unknown, // тип данных, возвращаемых сервером
    Error, // тип возможной ошибки
    ForgotPasswordInputs // тип переменных (аргументов mutate)
  >({
    mutationFn: sendRecoveryEmail,
    onSuccess: (data, variables) => {
      // сохраняем email в кэше, чтобы переиспользовать на других страницах
      queryClient.setQueryData(['recovery-email'], variables.email)
    }
  })
}
