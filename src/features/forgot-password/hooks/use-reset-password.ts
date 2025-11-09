'use client'
import { useMutation } from '@tanstack/react-query'
import { resendRecoveryEmail, setNewPassword } from '../api'

// Хук для повторной отправки письма восстановления
export const useResendRecoveryEmail = () => {
  return useMutation({
    mutationFn: resendRecoveryEmail
  })
}

// Хук для установки нового пароля
export const useSetNewPassword = () => {
  return useMutation({
    mutationFn: (data: { newPassword: string; recoveryCode: string }) =>
      setNewPassword(data.newPassword, data.recoveryCode)
  })
}
