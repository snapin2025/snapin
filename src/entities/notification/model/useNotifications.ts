'use client'

import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../api/notification'
import type { Notification, NotificationsResponse } from '../api/notification-types'
import { SOCKET_EVENTS } from '../api/notification-types'
import { subscribeToEvent } from './socket/subscribeToEvent'

const QUERY_KEY = ['notifications'] as const
const PAGE_SIZE = 100

const getNotificationTime = (notification: Notification) => {
  const timestamp = Date.parse(notification.notifyAt ?? notification.createdAt)
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const sortUnreadFirstByDateDesc = (items: Notification[]) =>
  [...items].sort((left, right) => {
    if (left.isRead !== right.isRead) {
      return left.isRead ? 1 : -1
    }
    const timeDiff = getNotificationTime(right) - getNotificationTime(left)
    if (timeDiff !== 0) {
      return timeDiff
    }
    return right.id - left.id
  })

function addSocketToTop(current: NotificationsResponse, incoming: Notification[]): NotificationsResponse {
  const incomingById = new Map(incoming.map((notification) => [notification.id, notification]))
  const existingIds = new Set(current.items.map((notification) => notification.id))
  const newItems = incoming.filter((notification) => !existingIds.has(notification.id))

  const updatedItems = current.items.map((notification) => {
    const next = incomingById.get(notification.id)
    return next ? { ...notification, ...next } : notification
  })

  if (!newItems.length && updatedItems.every((item, index) => item === current.items[index])) {
    return current
  }

  const items = [...newItems, ...updatedItems]
  const notReadCount = items.reduce((acc, item) => acc + (item.isRead ? 0 : 1), 0)

  return {
    items,
    totalCount: current.totalCount + newItems.length,
    notReadCount
  }
}

export function NotificationsSocket() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = subscribeToEvent<Notification | Notification[]>(SOCKET_EVENTS.NOTIFICATIONS, (payload) => {
      const incoming = Array.isArray(payload) ? payload : [payload]
      queryClient.setQueryData<NotificationsResponse>(QUERY_KEY, (current) => {
        if (!current) return current
        return addSocketToTop(current, incoming)
      })
    })
    return () => unsubscribe()
  }, [queryClient])

  return null
}

export function useNotifications() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      notificationApi.getAll({
        pageSize: PAGE_SIZE,
        sortBy: 'notifyAt',
        sortDirection: 'desc',
        unreadFirst: true
      }),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1
  })

  const markAsReadMutation = useMutation<void, Error, number[], { previous?: NotificationsResponse }>({
    mutationFn: (ids: number[]) => notificationApi.markAsRead(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueryData<NotificationsResponse>(QUERY_KEY)
      queryClient.setQueryData<NotificationsResponse>(QUERY_KEY, (current) => {
        if (!current) return current
        const set = new Set(ids)
        let delta = 0
        const items = current.items.map((n) => {
          if (set.has(n.id) && !n.isRead) {
            delta += 1
            return { ...n, isRead: true }
          }
          return n
        })
        return {
          ...current,
          items,
          notReadCount: Math.max(0, current.notReadCount - delta)
        }
      })
      return { previous }
    },
    onError: (_err, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(QUERY_KEY, context.previous)
    }
  })

  const notifications = sortUnreadFirstByDateDesc(data?.items ?? [])

  return {
    isLoading,
    notifications,
    unreadCount: data?.notReadCount ?? 0,
    markAsRead: (id: number, isRead: boolean) => {
      if (!isRead) markAsReadMutation.mutate([id])
    }
  }
}
