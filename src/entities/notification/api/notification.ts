import { api } from '@/shared/api'
import type { NotificationsResponse, NotificationsQueryParams } from './notification-types'

const PAGE_SIZE = 10

export const notificationApi = {
  getNotifications: async (
    cursor: number | undefined,
    params: NotificationsQueryParams = {}
  ): Promise<NotificationsResponse> => {
    const path = cursor ? `/notifications/${cursor}` : '/notifications'
    const { data } = await api.get<NotificationsResponse>(path, {
      params: {
        pageSize: params.pageSize ?? PAGE_SIZE,
        sortDirection: params.sortDirection ?? 'desc'
      }
    })
    return data
  },

  markAsRead: async (ids: number[]): Promise<void> => {
    await api.put('/notifications/mark-as-read', { ids })
  }
}
