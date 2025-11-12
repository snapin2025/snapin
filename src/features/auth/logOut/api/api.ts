import { api } from '@/shared/api'
import type { LogoutResponse } from './types'

export const logout = async (): Promise<LogoutResponse> => {
  await api.post<LogoutResponse>('/auth/logout')
}
