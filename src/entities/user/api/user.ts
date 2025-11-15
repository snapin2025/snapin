import { api } from '@/shared/api'
import { SignInRequest, SignInResponse, User } from './user-types'
import {
  ResendRecoveryEmailType,
  SendRecoveryEmailType,
  SetNewPasswordType
} from '@/features/auth/forgot-password/api/types'
import { ForgotPasswordInputs } from '@/features/auth/forgot-password/model/validateInput'

export const userApi = {
  me: async () => {
    const { data } = await api.get<User>('/auth/me')
    return data
  },
  signIn: async (payload: SignInRequest) => {
    const { data } = await api.post<SignInResponse>('/auth/login', payload)
    return data
  },
  sendRecoveryEmail: async (payload: ForgotPasswordInputs) => {
    const { data } = await api.post<SendRecoveryEmailType>('/auth/password-recovery', {
      email: payload.email,
      recaptcha: payload.recaptcha
    })
    return data
  },
  // повторная отправка — ожидаем строку email
  resendRecoveryEmail: async (email: string) => {
    const { data } = await api.post<ResendRecoveryEmailType>('/auth/password-recovery-resending', {
      email
    })
    return data
  },
  // установка нового пароля — принимаем объект с newPassword и recoveryCode
  SetNewPassword: async (payload: { newPassword: string; recoveryCode: string }) => {
    const { data } = await api.post<SetNewPasswordType>('/auth/new-password', {
      newPassword: payload.newPassword,
      recoveryCode: payload.recoveryCode
    })
    return data
  }
}
