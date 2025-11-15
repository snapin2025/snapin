'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/entities/user'

// Хук для повторной отправки письма восстановления
export const useResendRecoveryEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.resendRecoveryEmail,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['recovery-email'], variables)
    }
  })
}
