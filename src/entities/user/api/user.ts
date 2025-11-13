import { api } from '@/shared/api'
import { User } from './user-types'

export const userApi = {
  me: async () => {
    const { data } = await api.get<User>('/auth/me')
    return data
  }
}
