import { api } from '@/shared/api'
import type { NotificationsResponse } from './notification-types'

export type GetNotificationsParams = {
  cursor?: number
  sortBy?: 'notifyAt'
  isRead?: boolean
  pageSize?: number
  sortDirection?: 'asc' | 'desc'
  unreadFirst?: boolean
}

export const notificationApi = {
  getAll: async (params: GetNotificationsParams = {}): Promise<NotificationsResponse> => {
    const { cursor, pageSize = 100 } = params

    const path = typeof cursor === 'number' ? `/notifications/${cursor}` : '/notifications'
    const { data } = await api.get<NotificationsResponse>(path, {
      params: {
        pageSize
      }
    })
    return data
  },

  markAsRead: async (ids: number[]): Promise<void> => {
    await api.put('/notifications/mark-as-read', { ids })
  }
}
