'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SendRecoveryEmailType, userApi } from '@/entities/user'
import { AxiosError } from 'axios'

export const useForgotPassword = () => {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    // ↑ ✔ ИСПРАВЛЕНО: добавили первый generic — тип успешного ответа (Swagger: 204 No Content → void)

    AxiosError<{
      statusCode: number
      messages: { message: string; field: string }[]
    }>,
    // ↑ ✔ ИСПРАВЛЕНО: расширили тип ошибки под Swagger UC-3

    SendRecoveryEmailType
    // ↑ ✔ оставлено без изменений — аргументы mutate
  >({
    mutationFn: userApi.sendRecoveryEmail,

    onSuccess: (_data, variables) => {
      // сохраняем email в кэше, чтобы переиспользовать на других страницах
      queryClient.setQueryData(['recovery-email'], variables.email)
    }
  })
}
