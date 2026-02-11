'use client'

import { useEffect, useMemo, useCallback } from 'react'
import type { InfiniteData } from '@tanstack/react-query'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../api/notification'
import type { Notification, NotificationsResponse } from '../api/notification-types'
import { SOCKET_EVENTS } from '../api/notification-types'
import { subscribeToEvent } from './socket/subscribeToEvent'

const NOTIFICATIONS_PAGE_SIZE = 100
const NOTIFICATIONS_QUERY_KEY = ['notifications', 'infinite', NOTIFICATIONS_PAGE_SIZE] as const

type NotificationsInfiniteData = InfiniteData<NotificationsResponse, number | null>

// Глобальный флаг для предотвращения множественных подписок
let isSocketSubscribed = false

export const useNotifications = () => {
  const queryClient = useQueryClient()

  // Infinite Query для пагинации
  const notificationsQuery = useInfiniteQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: ({ pageParam }) =>
      notificationApi.getAll({
        cursor: pageParam ?? undefined,
        pageSize: NOTIFICATIONS_PAGE_SIZE
      }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => {
      // Если страница неполная или пустая - больше данных нет
      if (!lastPage.items.length || lastPage.items.length < NOTIFICATIONS_PAGE_SIZE) {
        return undefined
      }
      // Cursor = ID последнего элемента
      return lastPage.items[lastPage.items.length - 1]?.id ?? undefined
    },
    staleTime: Infinity, // Данные всегда актуальны (WebSocket)
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1
  })

  // Mutation для пометки как прочитанное
  const markAsReadMutation = useMutation({
    mutationFn: (ids: number[]) => notificationApi.markAsRead(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      const previousData = queryClient.getQueryData<NotificationsInfiniteData>(NOTIFICATIONS_QUERY_KEY)
      const idsSet = new Set(ids)

      queryClient.setQueryData<NotificationsInfiniteData>(NOTIFICATIONS_QUERY_KEY, (oldData) => {
        if (!oldData?.pages.length) return oldData

        let markedAsReadCount = 0

        // Обновляем все страницы
        const updatedPages = oldData.pages.map((page) => ({
          ...page,
          items: page.items.map((notification) => {
            if (idsSet.has(notification.id) && !notification.isRead) {
              markedAsReadCount += 1
              return { ...notification, isRead: true }
            }
            return notification
          })
        }))

        // Обновляем счетчик в первой странице
        if (markedAsReadCount > 0 && updatedPages[0]) {
          updatedPages[0] = {
            ...updatedPages[0],
            notReadCount: Math.max(0, updatedPages[0].notReadCount - markedAsReadCount)
          }
        }

        return {
          ...oldData,
          pages: updatedPages
        }
      })

      return { previousData }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(NOTIFICATIONS_QUERY_KEY, context.previousData)
      }
    }
  })

  // Плоский список с сортировкой (непрочитанные вверху)
  const notifications = useMemo(() => {
    const pages = notificationsQuery.data?.pages ?? []
    const uniqueById = new Map<number, Notification>()

    // Дедупликация по ID
    pages.forEach((page) => {
      page.items.forEach((item) => {
        if (!uniqueById.has(item.id)) {
          uniqueById.set(item.id, item)
        }
      })
    })

    const allNotifications = Array.from(uniqueById.values())

    // Разделяем на непрочитанные и прочитанные
    const unread: Notification[] = []
    const read: Notification[] = []

    allNotifications.forEach((notification) => {
      if (notification.isRead) {
        read.push(notification)
      } else {
        unread.push(notification)
      }
    })

    // Непрочитанные всегда вверху
    return [...unread, ...read]
  }, [notificationsQuery.data])

  // Счетчик непрочитанных
  const unreadCount = notificationsQuery.data?.pages[0]?.notReadCount ?? 0

  // Обработчик пометки как прочитанное
  const { mutate: mutateMarkAsRead } = markAsReadMutation
  const markAsRead = useCallback(
    (notificationId: number, isRead: boolean) => {
      if (!isRead) {
        mutateMarkAsRead([notificationId])
      }
    },
    [mutateMarkAsRead]
  )

  // WebSocket интеграция (глобальная подписка - только один раз)
  useEffect(() => {
    // Если уже подписаны - пропускаем
    if (isSocketSubscribed) {
      return
    }

    isSocketSubscribed = true

    const handleNewNotification = (payload: Notification | Notification[]) => {
      const incoming = Array.isArray(payload) ? payload : [payload]

      queryClient.setQueryData<NotificationsInfiniteData>(NOTIFICATIONS_QUERY_KEY, (oldData) => {
        if (!oldData?.pages.length) return oldData

        const firstPage = oldData.pages[0]
        if (!firstPage) return oldData

        // Фильтруем дубликаты
        const existingIds = new Set(firstPage.items.map((n) => n.id))
        const newNotifications = incoming.filter((n) => !existingIds.has(n.id))

        if (!newNotifications.length) return oldData

        // Считаем новые непрочитанные
        const newUnreadCount = newNotifications.filter((n) => !n.isRead).length

        // Добавляем в начало первой страницы
        return {
          ...oldData,
          pages: [
            {
              ...firstPage,
              items: [...newNotifications, ...firstPage.items],
              notReadCount: firstPage.notReadCount + newUnreadCount,
              totalCount: firstPage.totalCount + newNotifications.length
            },
            ...oldData.pages.slice(1)
          ]
        }
      })
    }

    const unsubscribe = subscribeToEvent<Notification | Notification[]>(
      SOCKET_EVENTS.NOTIFICATIONS,
      handleNewNotification
    )

    // Cleanup: отписываемся и сбрасываем флаг
    return () => {
      unsubscribe()
      isSocketSubscribed = false
    }
  }, [queryClient])

  return {
    notifications,
    unreadCount,
    isLoading: notificationsQuery.isPending,
    isFetchingNextPage: notificationsQuery.isFetchingNextPage,
    hasNextPage: notificationsQuery.hasNextPage,
    fetchNextPage: notificationsQuery.fetchNextPage,
    markAsRead
  }
}
