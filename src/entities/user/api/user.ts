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
  sendRecoveryEmail: async (payload: SendRecoveryEmailType) => {
    const { data } = await api.post<SendRecoveryEmailType>('/auth/password-recovery', {
      email: payload.email,
      recaptcha: payload.recaptcha,
      baseUrl: payload.baseUrl
    })
    return data
  },
  resendRecoveryEmail: async (payload: ResendRecoveryEmailType) => {
    const { data } = await api.post<ResendRecoveryEmailType>('/auth/password-recovery-resending', {
      email: payload.email,
      baseUrl: payload.baseUrl
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
  },
  logout: async (): Promise<LogoutResponse> => {
    await api.post<LogoutResponse>('/auth/logout')
  }
}
