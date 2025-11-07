import { api } from '@/shared/api'
import type { SignInRequest, SignInResponse, UserMeResponse } from './types'

export const signIn = async (payload: SignInRequest) => {
  const { data } = await api.post<SignInResponse>('/auth/login', payload)
  return data
}

export const getMe = async () => {
  const { data } = await api.get<UserMeResponse>('/auth/me')
  return data
}
