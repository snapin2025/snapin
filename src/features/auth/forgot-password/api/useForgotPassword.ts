'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { SendRecoveryEmailType, userApi } from '@/entities/user'
import { AxiosError } from 'axios'

export const useForgotPassword = () => {
  const queryClient = useQueryClient()

  return useMutation<
    unknown, // тип данных, возвращаемых сервером
    AxiosError<{ message: string }>, // тип ошибки
    SendRecoveryEmailType // тип переменных (аргументов mutate)
  >({
    mutationFn: userApi.sendRecoveryEmail,
    onSuccess: (data, variables) => {
      // сохраняем email в кэше, чтобы переиспользовать на других страницах
      queryClient.setQueryData(['recovery-email'], variables.email)
    }
  })
}
