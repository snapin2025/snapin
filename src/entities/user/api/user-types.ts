export type User = {
  userId: number
  userName: string
  email: string
  isBlocked: boolean
}

export type SignInRequest = {
  email: string
  password: string
}

export type SignInResponse = {
  accessToken: string
}

export type SignUpRequest = {
  userName: string
  email: string
  password: string
}

export type SignUpSuccessResponse = {
  statusCode: 204
}

export type SignUpErrorResponse = {
  statusCode: number // 400
  messages: {
    message: string
    field: 'email' | 'password' | 'userName'
  }[]
  error: string // "Bad Request"
}

export type SignUpResponse = SignUpErrorResponse | SignUpSuccessResponse

//(эндпоинт: /auth/password-recovery)
export type SendRecoveryEmailType = {
  email: string
  recaptcha: string
  baseUrl: string
}

// Тип для ПОВТОРНОЙ отправки письма (эндпоинт: /auth/password-recovery-resending)
export type ResendRecoveryEmailType = {
  email: string // Email пользователя для повторной отправки
  baseUrl: string
}

// Тип для установки НОВОГО ПАРОЛЯ (эндпоинт: /auth/new-password)
export type SetNewPasswordType = {
  newPassword: string // Новый пароль пользователя
  recoveryCode: string // Код восстановления из письма
}

export type LogoutResponse = void

export type ConfirmRequest = {
  confirmationCode: string
}

export type ConfirmErrorResponse = {
  statusCode: number
  messages: {
    message: string
    field: string
  }[]
  error: string
}

export type ConfirmResponse = void | ConfirmErrorResponse
