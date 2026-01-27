'use client'

import { useInfiniteQuery, useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'
import { notificationApi } from '../api/notification'
import type { NotificationsResponse, NewNotification } from '../api/notification-types'
import { SOCKET_EVENTS } from '../api/notification-types'
import { subscribeToEvent } from './socket/subscribeToEvent'

const QUERY_KEY = ['notifications'] as const

// Глобальный флаг — подписка должна быть одна на всё приложение
let isSubscribed = false

/**
 * Хук для WebSocket подписки (вызывается один раз)
 */
const useNotificationsSocket = () => {
  const queryClient = useQueryClient()
  const isSubscribedRef = useRef(false)

  useEffect(() => {
    // Проверяем глобальный флаг и локальный ref
    if (isSubscribed || isSubscribedRef.current) return

    isSubscribed = true
    isSubscribedRef.current = true

    const unsubscribe = subscribeToEvent<NewNotification>(SOCKET_EVENTS.NOTIFICATIONS, (newNotification) => {
      queryClient.setQueryData<InfiniteData<NotificationsResponse>>(QUERY_KEY, (old) => {
        if (!old?.pages.length) return old

        // Проверяем дубликат
        const exists = old.pages.some((page) => page.items.some((item) => item.id === newNotification.id))
        if (exists) return old

        const firstPage = old.pages[0]
        return {
          ...old,
          pages: [
            {
              ...firstPage,
              items: [newNotification, ...firstPage.items],
              totalCount: firstPage.totalCount + 1,
              notReadCount: firstPage.notReadCount + 1
            },
            ...old.pages.slice(1)
          ]
        }
      })
    })

    return () => {
      unsubscribe()
      isSubscribed = false
      isSubscribedRef.current = false
    }
  }, [queryClient])
}

/**
 * Базовый хук для уведомлений с пагинацией
 */
const useNotificationsQuery = () => {
  return useInfiniteQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam }) => notificationApi.getNotifications(pageParam),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.items.length) return null

      const totalLoaded = allPages.reduce((sum, page) => sum + page.items.length, 0)
      if (totalLoaded >= lastPage.totalCount) return null

      return lastPage.items.at(-1)?.id
    },
    staleTime: 60_000,
    gcTime: 300_000
  })
}

/**
 * Хук для списка уведомлений с бесконечным скроллом
 */
export const useNotificationsList = () => {
  // WebSocket подписка — только здесь, один раз
  useNotificationsSocket()

  const query = useNotificationsQuery()

  // Собираем уведомления из всех страниц с дедупликацией
  const notifications = useMemo(() => {
    if (!query.data?.pages) return []

    const seen = new Set<number>()
    return query.data.pages
      .flatMap((page) => page.items)
      .filter((item) => {
        if (seen.has(item.id)) return false
        seen.add(item.id)
        return true
      })
  }, [query.data?.pages])

  // Количество непрочитанных — берём из первой страницы
  const unreadCount = query.data?.pages[0]?.notReadCount ?? 0

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage
  }
}

/**
 * Хук для отметки уведомления как прочитанного
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => notificationApi.markAsRead([id]),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })

      // Оптимистичное обновление
      queryClient.setQueryData<InfiniteData<NotificationsResponse>>(QUERY_KEY, (old) => {
        if (!old) return old

        let wasUnread = false
        const pages = old.pages.map((page) => ({
          ...page,
          items: page.items.map((item) => {
            if (item.id !== id) return item
            if (!item.isRead) wasUnread = true
            return { ...item, isRead: true }
          })
        }))

        if (wasUnread && pages[0]) {
          pages[0] = { ...pages[0], notReadCount: Math.max(0, pages[0].notReadCount - 1) }
        }

        return { ...old, pages }
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    }
  })
}
