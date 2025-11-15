import { api } from '@/shared/api'
import { SignInRequest, SignInResponse, SignUpRequest, SignUpResponse, User } from './user-types'

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
  }
}
