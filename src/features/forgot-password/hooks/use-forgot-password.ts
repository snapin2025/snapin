'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendRecoveryEmail } from '../api'

// Хук для отправки email восстановления пароля
// Использует Tanstack Query для управления состоянием запроса

export const useForgotPassword = () => {
  const queryClient = useQueryClient() // ← добавить

  return useMutation({
    mutationFn: sendRecoveryEmail, // Функция которая отправляет запрос на сервер
    onSuccess: (data, variables) => {
      // Сохраняем email в Query Client для использования в других компонентах
      // ⭐ СОХРАНЯЕМ EMAIL ДЛЯ БУДУЩЕГО ИСПОЛЬЗОВАНИЯ
      queryClient.setQueryData(['recovery-email'], variables)
    }
  })
}
