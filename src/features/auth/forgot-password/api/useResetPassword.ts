'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ResendRecoveryEmailType, userApi } from '@/entities/user'

// Хук для повторной отправки письма восстановления
export const useResendRecoveryEmail = () => {
  const queryClient = useQueryClient()

  return useMutation<void, unknown, ResendRecoveryEmailType>({
    //  mutationFn теперь принимает объект payload с типом ResendRecoveryEmailType
    mutationFn: (payload: ResendRecoveryEmailType) => userApi.resendRecoveryEmail(payload),
    // onSuccess теперь сохраняет email из payload, а не весь объект
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(['recovery-email'], variables.email)
    }
  })
}
