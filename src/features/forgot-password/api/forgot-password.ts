// создаю запросы на // POST /auth/password-recovery  использую документацию свагер
import { api } from '@/shared/api'

export const sendRecoveryEmail = (email: string) => {
  return api.post('/auth/password-recovery', {
    email: email,
    recaptcha: 'mock-token'
  })
}
// POST /auth/password-recovery-resending - функция для повторная отправка
export const resendRecoveryEmail = (email: string) => {
  return api.post('/auth/password-recovery-resending', {
    email: email
  })
}
// Шаг 3: Установка нового пароля
export const setNewPassword = (newPassword: string, recoveryCode: string) => {
  return api.post('/auth/new-password', {
    newPassword,
    recoveryCode
  })
}
