import { api } from '@/shared/api'
import {
  CheckRecoveryCodePayload,
  CheckRecoveryCodeResponse,
  ConfirmErrorResponse,
  ConfirmRequest,
  CreatePostPayload,
  CreatePostResponse,
  EmailResendingErrorResponse,
  EmailResendingRequest,
  LogoutResponse,
  PostImagesPayload,
  PostImagesResponse,
  ResendRecoveryEmailType,
  SendRecoveryEmailType,
  SetNewPasswordType,
  SignInRequest,
  SignInResponse,
  SignUpErrorResponse,
  SignUpRequest,
  User
} from './user-types'

export const userApi = {
  me: async () => {
    const { data } = await api.get<User>('/auth/me')
    return data
  },
  signIn: async (payload: SignInRequest) => {
    const { data } = await api.post<SignInResponse>('/auth/login', payload)
    console.log(data)
    return data
  },
  signUp: async (payload: SignUpRequest): Promise<void> => {
    await api.post<void | SignUpErrorResponse>('/auth/registration', payload)
  },
  confirm: async (payload: ConfirmRequest): Promise<void> => {
    await api.post<void | ConfirmErrorResponse>('/auth/registration-confirmation', payload)
  },
  emailResending: async (payload: EmailResendingRequest): Promise<void> => {
    await api.post<EmailResendingErrorResponse>('/auth/registration-email-resending', payload)
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
  //запросы для проверки кода
  checkRecoveryCode: async (payload: CheckRecoveryCodePayload): Promise<CheckRecoveryCodeResponse> => {
    const response = await api.post<CheckRecoveryCodeResponse>('/auth/check-recovery-code', payload)
    return response.data
  },

  logout: async (): Promise<LogoutResponse> => {
    await api.post<LogoutResponse>('/auth/logout')
  },
  createPost: async (payload: CreatePostPayload): Promise<CreatePostResponse> => {
    const { data } = await api.post<CreatePostResponse>('/api/v1/posts', payload)
    return data
  },

  createPostImage: async (payload: PostImagesPayload): Promise<PostImagesResponse> => {
    const formData = new FormData()
    payload.files.forEach((file) => {
      formData.append('file', file)
    })

    const { data } = await api.post<PostImagesResponse>('/api/v1/posts/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  }
}
