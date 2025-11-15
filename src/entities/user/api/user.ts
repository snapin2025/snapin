import { api } from '@/shared/api'
import { SignInRequest, SignInResponse, User } from './user-types'

export const userApi = {
  me: async () => {
    const { data } = await api.get<User>('/auth/me')
    return data
  },
  signIn: async (payload: SignInRequest) => {
    const { data } = await api.post<SignInResponse>('/auth/login', payload)
    return data
  }
}
