import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '@/entities/notification/api/notification'
import type { Notification, NotificationsResponse } from '@/entities/notification/api/notification-types'
import { SOCKET_EVENTS } from '@/entities/notification/api/notification-types'
import { subscribeToEvent } from './socket/subscribeToEvent'

const NOTIFICATIONS_QUERY_KEY = ['notifications']

export const useNotifications = () => {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: () => notificationApi.getAll(),

    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1
  })

  const markAsReadMutation = useMutation<void, unknown, number[], { previous?: NotificationsResponse }>({
    mutationFn: (ids: number[]) => notificationApi.markAsRead(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      const previous = queryClient.getQueryData<NotificationsResponse>(NOTIFICATIONS_QUERY_KEY)

      queryClient.setQueryData<NotificationsResponse>(NOTIFICATIONS_QUERY_KEY, (current) => {
        if (!current) {
          return current
        }
        const idsSet = new Set(ids)
        const updatedItems = current.items.map((item) => (idsSet.has(item.id) ? { ...item, isRead: true } : item))
        const newlyReadCount = current.items.reduce(
          (acc, item) => acc + (idsSet.has(item.id) && !item.isRead ? 1 : 0),
          0
        )

        return {
          ...current,
          items: updatedItems,
          notReadCount: Math.max(0, current.notReadCount - newlyReadCount)
        }
      })

      return { previous }
    },
    onError: (_error, _ids, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previous)
      }
    }
  })

  useEffect(() => {
    const unsubscribe = subscribeToEvent<Notification | Notification[]>(
      SOCKET_EVENTS.NOTIFICATIONS,
      (payload) => {
        queryClient.setQueryData<NotificationsResponse>(NOTIFICATIONS_QUERY_KEY, (current) => {
          const incomingItems = Array.isArray(payload) ? payload : [payload]
          const existingItems = current?.items ?? []
          const existingIds = new Set(existingItems.map((item) => item.id))
          const dedupedIncoming = incomingItems.filter((item) => !existingIds.has(item.id))

          if (dedupedIncoming.length === 0) {
            return current
          }

          const addedUnread = dedupedIncoming.reduce((acc, item) => acc + (item.isRead ? 0 : 1), 0)

          return {
            items: [...dedupedIncoming, ...existingItems],
            totalCount: (current?.totalCount ?? 0) + dedupedIncoming.length,
            notReadCount: (current?.notReadCount ?? 0) + addedUnread
          }
        })
      }
    )

    return () => {
      unsubscribe()
    }
  }, [queryClient])

  const notifications = [...(data?.items ?? [])].sort((first, second) => {
    if (first.isRead !== second.isRead) {
      return first.isRead ? 1 : -1
    }
    return Date.parse(second.notifyAt ?? second.createdAt) - Date.parse(first.notifyAt ?? first.createdAt)
  })

  const unreadCount = notifications.reduce((acc, notification) => acc + (notification.isRead ? 0 : 1), 0)

  return {
    isLoading,
    notifications,
    unreadCount,
    markAsRead: (id: number, isRead: boolean) => {
      if (!isRead) {
        markAsReadMutation.mutate([id])
      }
    }
  }
}
