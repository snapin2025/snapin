// Типы для восстановления пароля

// Типы для восстановления пароля

// Тип для ПЕРВОЙ отправки письма восстановления (эндпоинт: /auth/password-recovery)
export type SendRecoveryEmailType = {
  email: string // Email пользователя для отправки письма
  recaptcha: string // Код капчи (пока заглушка)
  baseUrl: string // Адрес фронтенда для ссылки в письме
}

// Тип для ПОВТОРНОЙ отправки письма (эндпоинт: /auth/password-recovery-resending)
export type ResendRecoveryEmailType = {
  email: string // Email пользователя для повторной отправки
  baseUrl: string // Адрес фронтенда для ссылки в письме
}

// Тип для установки НОВОГО ПАРОЛЯ (эндпоинт: /auth/new-password)
export type SetNewPasswordType = {
  newPassword: string // Новый пароль пользователя
  recoveryCode: string // Код восстановления из письма
}
