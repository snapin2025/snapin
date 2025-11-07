// Типы для API
import { ApiClient } from '@/shared/api/client/api-client'

interface PasswordRecoveryCodeInputDto {
  email: string
  code: string
}

interface PasswordRecoveryViewDto {
  valid: boolean
}

interface ProviderCodeInputDto {
  code: string
}

interface ProviderLoginResSwaggerDto {
  accessToken: string
  refreshToken: string
}

interface LoginInputDto {
  email: string
  password: string
}

interface TokenTypeSwaggerDto {
  accessToken: string
}

interface NewPasswordInputDto {
  password: string
  recoveryCode: string
}

interface PasswordRecoveryInputDto {
  email: string
}

interface PasswordRecoveryResendingInputDto {
  email: string
}

interface RegisterInputDto {
  email: string
  password: string
  name: string
}

interface ConfirmationCodeInputDto {
  code: string
}

interface RegistrationEmailResendingInputDto {
  email: string
}

interface MeViewDto {
  id: string
  email: string
  name: string
}

// Типизированные эндпоинты Auth
interface ApiEndpoints {
  '/api/v1/auth/check-recovery-code': {
    POST: { body: PasswordRecoveryCodeInputDto; data: PasswordRecoveryViewDto }
  }
  '/api/v1/auth/github/login': {
    GET: { data: { accessToken: string; refreshToken: string; email: string } }
  }
  '/api/v1/auth/github/update-tokens': {
    POST: { data: TokenTypeSwaggerDto }
  }
  '/api/v1/auth/google/login': {
    POST: { body: ProviderCodeInputDto; data: ProviderLoginResSwaggerDto }
  }
  '/api/v1/auth/login': {
    POST: { body: LoginInputDto; data: TokenTypeSwaggerDto }
  }
  '/api/v1/auth/logout': {
    POST: { data: void }
  }
  '/api/v1/auth/me': {
    GET: { data: MeViewDto }
  }
  '/api/v1/auth/new-password': {
    POST: { body: NewPasswordInputDto; data: void }
  }
  '/api/v1/auth/password-recovery': {
    POST: { body: PasswordRecoveryInputDto; data: void }
  }
  '/api/v1/auth/password-recovery-resending': {
    POST: { body: PasswordRecoveryResendingInputDto; data: void }
  }
  '/api/v1/auth/registration': {
    POST: { body: RegisterInputDto; data: void }
  }
  '/api/v1/auth/registration-confirmation': {
    POST: { body: ConfirmationCodeInputDto; data: void }
  }
  '/api/v1/auth/registration-email-resending': {
    POST: { body: RegistrationEmailResendingInputDto; data: void }
  }
  '/api/v1/auth/update': {
    POST: { data: TokenTypeSwaggerDto }
  }
  '/api/v1/auth/update-tokens': {
    POST: { data: TokenTypeSwaggerDto }
  }
}

type ApiResponseData<T extends keyof ApiEndpoints, M extends keyof ApiEndpoints[T]> = ApiEndpoints[T][M] extends {
  data: infer D
}
  ? D
  : never

export class TypedAuthApiClient extends ApiClient {
  async getTyped<T extends keyof ApiEndpoints, M extends keyof ApiEndpoints[T]>(
    endpoint: T,
    method: M extends 'GET' ? 'GET' : never
  ): Promise<ApiResponseData<T, M>> {
    const response = await this.get<Promise<ApiResponseData<T, M>>>(endpoint as string)
    return response.data
  }

  async postTyped<T extends keyof ApiEndpoints, M extends keyof ApiEndpoints[T]>(
    endpoint: T,
    method: M extends 'POST' ? 'POST' : never
  ): Promise<ApiResponseData<T, M>> {
    const response = await this.post<Promise<ApiResponseData<T, M>>>(endpoint as string)
    return response.data
  }

  async putTyped<T extends keyof ApiEndpoints, M extends keyof ApiEndpoints[T]>(
    endpoint: T,
    method: M extends 'PUT' ? 'PUT' : never
  ): Promise<ApiResponseData<T, M>> {
    const response = await this.put<Promise<ApiResponseData<T, M>>>(endpoint as string)
    return response.data
  }

  async deleteTyped<T extends keyof ApiEndpoints, M extends keyof ApiEndpoints[T]>(
    endpoint: T,
    method: M extends 'DELETE' ? 'DELETE' : never
  ): Promise<ApiResponseData<T, M>> {
    const response = await this.delete<Promise<ApiResponseData<T, M>>>(endpoint as string)
    return response.data
  }
}
