// запрос для подписок и отписок пользователя
import { api } from '@/shared/api'
import { FollowParams, UnfollowParams } from './types'

// Подписаться на пользователя
export const followApi = {
  follow: async (params: FollowParams): Promise<void> => {
    await api.post('/users/following', {
      selectedUserId: params.selectedUserId
    })
  },

  // Отписаться от пользователя
  unfollow: async (params: UnfollowParams): Promise<void> => {
    await api.delete(`/users/follower/${params.userId}`)
  }
}
