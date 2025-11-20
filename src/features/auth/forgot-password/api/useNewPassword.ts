'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/entities/user'

// Хук для установки нового пароля
export const useSetNewPassword = () => {
  const queryClient = useQueryClient()
  return useMutation<void, unknown, { newPassword: string; recoveryCode: string }>({
    mutationFn: (data: { newPassword: string; recoveryCode: string }) => userApi.SetNewPassword(data),
    onSuccess: () => {
      // Очищаем сохраненные данные после успешной смены пароля
      queryClient.removeQueries({ queryKey: ['recovery-email'] })
    }
  })
}
