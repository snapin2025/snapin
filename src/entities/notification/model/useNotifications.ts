'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationStorage, Notification } from '../api'

const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const

/**
 * Хук для получения списка уведомлений из localStorage через React Query
 */
export const useNotifications = () => {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: () => {
      return notificationStorage.getNotifications()
    },
    staleTime: 0, // Всегда считаем данные свежими, но не делаем лишних запросов
    gcTime: Infinity, // Не удаляем из кэша
    initialData: () => {
      // Загружаем начальные данные из localStorage
      return notificationStorage.getNotifications()
    }
  })
}

/**
 * Хук для получения количества непрочитанных уведомлений
 */
export const useUnreadNotificationsCount = () => {
  const { data: notifications = [] } = useNotifications()

  if (!Array.isArray(notifications)) {
    return 0
  }

  return notifications.filter((notification) => !notification.isRead).length
}

/**
 * Хук для отметки уведомления как прочитанного
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: number) => {
      const notifications = notificationStorage.getNotifications()
      const updated = notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      notificationStorage.saveNotifications(updated)
      return updated
    },
    onSuccess: (updatedNotifications) => {
      // Обновляем кэш React Query
      queryClient.setQueryData<Notification[]>(NOTIFICATIONS_QUERY_KEY, updatedNotifications)
    }
  })
}

/**
 * Хук для отметки всех уведомлений как прочитанных
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      const notifications = notificationStorage.getNotifications()
      const updated = notifications.map((n) => ({ ...n, isRead: true }))
      notificationStorage.saveNotifications(updated)
      return updated
    },
    onSuccess: (updatedNotifications) => {
      // Обновляем кэш React Query
      queryClient.setQueryData<Notification[]>(NOTIFICATIONS_QUERY_KEY, updatedNotifications)
    }
  })
}

/**
 * Функция для добавления нового уведомления в кэш (используется WebSocket)
 * Должна вызываться из WebSocket хука с queryClient
 */
export const addNotificationToCache = (queryClient: ReturnType<typeof useQueryClient>, notification: Notification) => {
  // Обновляем кэш React Query
  queryClient.setQueryData<Notification[]>(NOTIFICATIONS_QUERY_KEY, (old = []) => {
    // Проверяем, нет ли уже такого уведомления
    if (old.some((n) => n.id === notification.id)) {
      return old
    }

    // Добавляем новое уведомление в начало списка
    const updated = [notification, ...old]

    // Сохраняем в localStorage
    notificationStorage.saveNotifications(updated)

    return updated
  })
}
