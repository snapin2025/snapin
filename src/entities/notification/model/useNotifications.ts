'use client'

import { useEffect, useRef } from 'react'
import type { InfiniteData } from '@tanstack/react-query'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi } from '../api/notification'
import type { Notification, NotificationsResponse } from '../api/notification-types'
import { SOCKET_EVENTS } from '../api/notification-types'
import { subscribeToEvent } from './socket/subscribeToEvent'

const QUERY_KEY = ['notifications'] as const
const PAGE_SIZE = 10
type NotificationsPages = InfiniteData<NotificationsResponse>

const toTimestamp = (value?: string) => {
  if (!value) return 0
  const ts = Date.parse(value)
  return Number.isNaN(ts) ? 0 : ts
}

const flattenPages = (pages?: NotificationsPages) => pages?.pages.flatMap((page) => page.items) ?? []

const uniqueById = (items: Notification[]) => {
  const map = new Map<number, Notification>()
  for (const item of items) {
    if (!map.has(item.id)) map.set(item.id, item)
  }
  return Array.from(map.values())
}

const sortByNotifyAtDesc = (items: Notification[]) =>
  [...items].sort((a, b) => {
    const timeA = toTimestamp(a.notifyAt ?? a.createdAt)
    const timeB = toTimestamp(b.notifyAt ?? b.createdAt)
    if (timeA !== timeB) return timeB - timeA
    return b.id - a.id
  })

const countUnread = (items: Notification[]) => items.filter((n) => !n.isRead).length

function mergeIncoming(current: NotificationsPages, incoming: Notification[]): NotificationsPages {
  const firstPage = current.pages[0]
  const items = firstPage?.items ?? []
  const allIds = new Set(current.pages.flatMap((page) => page.items.map((n) => n.id)))
  const newItems = incoming.filter((n) => !allIds.has(n.id))
  if (newItems.length === 0) return current

  const addedUnread = newItems.filter((n) => !n.isRead).length
  const nextFirstPage: NotificationsResponse = {
    ...firstPage,
    items: [...newItems, ...items],
    totalCount: (firstPage?.totalCount ?? 0) + newItems.length,
    notReadCount: (firstPage?.notReadCount ?? 0) + addedUnread
  }

  return {
    ...current,
    pages: [nextFirstPage, ...current.pages.slice(1)]
  }
}

export const useNotifications = () => {
  const queryClient = useQueryClient()
  const pendingRef = useRef<Notification[]>([])
  const autoFillRef = useRef(false)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ pageParam }: { pageParam?: number }) =>
      notificationApi.getAll({ cursor: pageParam, pageSize: PAGE_SIZE }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage, allPages) => {
      const lastItem = lastPage.items[lastPage.items.length - 1]
      if (!lastItem) return undefined
      const loadedCount = allPages.reduce((sum, page) => sum + page.items.length, 0)
      const totalCount = allPages[0]?.totalCount ?? lastPage.totalCount
      if (loadedCount >= totalCount) return undefined
      return lastItem.id
    },
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1
  })

  useEffect(() => {
    const unsubscribe = subscribeToEvent<Notification | Notification[]>(SOCKET_EVENTS.NOTIFICATIONS, (payload) => {
      const incoming = Array.isArray(payload) ? payload : [payload]

      queryClient.setQueryData<NotificationsPages>(QUERY_KEY, (current) => {
        if (!current) {
          pendingRef.current = [...pendingRef.current, ...incoming]
          return current
        }
        return mergeIncoming(current, incoming)
      })
    })
    return () => {
      unsubscribe()
    }
  }, [queryClient])

  useEffect(() => {
    if (!data || pendingRef.current.length === 0) return
    const pending = pendingRef.current
    pendingRef.current = []
    queryClient.setQueryData<NotificationsPages>(QUERY_KEY, (current) => {
      if (!current) return current
      return mergeIncoming(current, pending)
    })
  }, [data, queryClient])

  // markAsRead с оптимистичным обновлением (как RTK mutation)
  const markAsReadMutation = useMutation<void, Error, number[], { previous?: NotificationsPages }>({
    mutationFn: (ids: number[]) => notificationApi.markAsRead(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueryData<NotificationsPages>(QUERY_KEY)

      queryClient.setQueryData<NotificationsPages>(QUERY_KEY, (current) => {
        if (!current) return current
        const idsSet = new Set(ids)
        let newlyRead = 0
        const pages = current.pages.map((page) => {
          const items = page.items.map((n) => {
            if (idsSet.has(n.id) && !n.isRead) {
              newlyRead += 1
              return { ...n, isRead: true }
            }
            return n
          })
          return { ...page, items }
        })
        if (pages[0]) {
          pages[0] = {
            ...pages[0],
            notReadCount: Math.max(0, pages[0].notReadCount - newlyRead)
          }
        }
        return { ...current, pages }
      })
      return { previous }
    },
    onError: (_err, _ids, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEY, context.previous)
      }
    }
  })

  const notifications = sortByNotifyAtDesc(uniqueById(flattenPages(data)))
  const unreadCount = data?.pages[0]?.notReadCount ?? countUnread(notifications)
  const unreadLoadedCount = countUnread(notifications)

  useEffect(() => {
    if (!data || !hasNextPage) return
    if (autoFillRef.current) return
    if (unreadLoadedCount >= unreadCount) return

    autoFillRef.current = true
    const fillUnread = async () => {
      while (true) {
        const next = queryClient.getQueryData<NotificationsPages>(QUERY_KEY)
        const list = flattenPages(next)
        const currentUnread = countUnread(list)
        const totalUnread = next?.pages[0]?.notReadCount ?? unreadCount
        const totalCount = next?.pages[0]?.totalCount ?? list.length
        const canLoadMore = list.length < totalCount
        if (currentUnread >= totalUnread || !canLoadMore) break
        await fetchNextPage()
      }
      autoFillRef.current = false
    }
    fillUnread()
  }, [data, hasNextPage, unreadLoadedCount, unreadCount, fetchNextPage, queryClient])

  return {
    isLoading,
    notifications,
    unreadCount,
    fetchNextPage,
    hasNextPage: Boolean(hasNextPage),
    isFetchingNextPage,
    markAsRead: (id: number, isRead: boolean) => {
      if (!isRead) markAsReadMutation.mutate([id])
    }
  }
}
