'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { resendRecoveryEmail, setNewPassword } from '../api'

// Хук для повторной отправки письма восстановления
export const useResendRecoveryEmail = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resendRecoveryEmail,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['recovery-email'], variables)
    }
  })
}

// Хук для установки нового пароля
export const useSetNewPassword = () => {
  const queryClient = useQueryClient() // ← ДОБАВИТЬ эту строку
  return useMutation({
    mutationFn: (data: { newPassword: string; recoveryCode: string }) =>
      setNewPassword(data.newPassword, data.recoveryCode),
    onSuccess: (data) => {
      // Очищаем сохраненные данные после успешной смены пароля
      queryClient.removeQueries({ queryKey: ['recovery-email'] })
    }
  })
}
