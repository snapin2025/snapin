// создаю запросы на // POST /auth/password-recovery  использую документацию свагер
import { api } from '@/shared/api'
import { SendRecoveryEmailType } from '@/features/forgot-password/api/types'

export const sendRecoveryEmail = (data: SendRecoveryEmailType) => {
  return api.post('/auth/password-recovery', {
    email: data.email,
    recaptcha: data.recaptcha
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
