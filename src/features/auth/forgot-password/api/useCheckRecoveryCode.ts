//recoveryCode
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { userApi } from '@/entities/user'
import { CheckRecoveryCodePayload, CheckRecoveryCodeResponse } from '@/entities/user/api/user-types'

// CheckRecoveryCodePayload — тело запроса { recoveryCode: string }
// CheckRecoveryCodeResponse — ответ { email: string }

export const useCheckRecoveryCode = () => {
  const queryClient = useQueryClient()

  return useMutation<
    CheckRecoveryCodeResponse,
    AxiosError<{ statusCode: number; messages: { message: string; field: string }[] }>,
    CheckRecoveryCodePayload
  >({
    mutationFn: (payload) => userApi.checkRecoveryCode(payload),
    onSuccess: (data) => {
      // Сохраняем email для дальнейшего использования на странице создания нового пароля
      queryClient.setQueryData(['recovery-email'], data.email)
    }
  })
}
