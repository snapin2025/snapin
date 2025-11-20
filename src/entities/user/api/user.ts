import { api } from '@/shared/api'
import {
  ConfirmRequest,
  ConfirmResponse,
  LogoutResponse,
  ResendRecoveryEmailType,
  SendRecoveryEmailType,
  SetNewPasswordType,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  User
} from './user-types'

export const userApi = {
  me: async () => {
    const { data } = await api.get<User>('/auth/me')
    return data
  },
  signIn: async (payload: SignInRequest) => {
    const { data } = await api.post<SignInResponse>('/auth/login', payload)
    return data
  },
  signUp: async (payload: SignUpRequest): Promise<SignUpResponse> => {
    const res = await api.post<SignUpResponse>('/auth/registration', payload)
    if (res.status === 204) {
      return { statusCode: 204 }
    }
    return res.data
  },
  confirm: async (payload: ConfirmRequest): Promise<void> => {
    await api.post<ConfirmResponse>('/auth/registration-confirmation', payload)
  },

  // ✔ Исправление №1 — Swagger: /auth/password-recovery возвращает 204 без тела
  // ❌ Было: api.post<SendRecoveryEmailType> — Неверно, это тип запроса, а не ответа
  // ✔ Стало: api.post без типа → тело не ожидается, всё корректно
  sendRecoveryEmail: async (payload: SendRecoveryEmailType): Promise<void> => {
    await api.post('/auth/password-recovery', {
      email: payload.email,
      recaptcha: payload.recaptcha,
      baseUrl: payload.baseUrl
    })
  },

  // ✔ Исправление №2 — Swagger: повторная отправка тоже возвращает 204
  // ❌ Было: api.post<ResendRecoveryEmailType> — Неверный тип ответа
  // ✔ Стало: просто await api.post(...)
  resendRecoveryEmail: async (payload: ResendRecoveryEmailType): Promise<void> => {
    await api.post('/auth/password-recovery-resending', {
      email: payload.email,
      baseUrl: payload.baseUrl
    })
  },

  // ✔ Исправление №3 — Swagger: new-password → 204 No Content
  // ❌ Было: post<SetNewPasswordType> — опять тип запроса как тип ответа
  // ✔ Стало: просто await api.post(...)
  SetNewPassword: async (payload: SetNewPasswordType): Promise<void> => {
    await api.post('/auth/new-password', {
      newPassword: payload.newPassword,
      recoveryCode: payload.recoveryCode
    })
  },
  logout: async (): Promise<LogoutResponse> => {
    await api.post<LogoutResponse>('/auth/logout')
  }
}
