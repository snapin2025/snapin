import { api } from '@/shared/api'
import type { SignUpRequest, SignUpResponse } from './types'

export const signUp = async (payload: SignUpRequest): Promise<SignUpResponse> => {
  const res = await api.post<SignUpResponse>('/auth/registration', payload)
  if (res.status === 204) {
    return {statusCode: 204}
  }
  return res.data
}
