import { useMutation } from '@tanstack/react-query'
import { sendRecoveryEmail } from '../api'

// Хук для отправки email восстановления пароля
// Использует Tanstack Query для управления состоянием запроса

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: sendRecoveryEmail // Функция которая отправляет запрос на сервер
  })
}
