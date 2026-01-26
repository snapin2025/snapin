'use client'

import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'
import { Notification } from '@/entities/notification'
import { addNotificationToCache } from '@/entities/notification/model/useNotifications'
import { useAuth } from '../auth-provider/auth-provider'

const WS_URL = 'https://inctagram.work'

/**
 * Хук для подключения к WebSocket и получения уведомлений в реальном времени
 * Подключается только для авторизованных пользователей
 * Использует React Query для обновления кэша
 */
export const useNotificationsWebSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const queryClient = useQueryClient()
  const { user } = useAuth()

  useEffect(() => {
    // Проверяем, что мы на клиенте, есть пользователь и токен
    if (typeof window === 'undefined' || !user) {
      return
    }

    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      return
    }

    // Создаем подключение к WebSocket
    const socket = io(WS_URL, {
      query: {
        accessToken
      },
      
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    })

    socketRef.current = socket

    // Слушаем событие NOTIFICATION
    socket.on('notifications', (data: unknown) => {
      console.log('Received notification via WebSocket:', data)

      // Преобразуем данные в формат Notification
      // Сервер может отправлять дополнительные поля (eventType, createdAt), которые мы игнорируем
      const notification: Notification = {
        id: (data as any).id,
        clientId: (data as any).clientId,
        message: (data as any).message,
        isRead: (data as any).isRead ?? false,
        notifyAt: (data as any).notifyAt || (data as any).createdAt
      }

      // Добавляем уведомление в кэш React Query
      // Это автоматически обновит все компоненты, использующие useNotifications
      addNotificationToCache(queryClient, notification)
    })

    // Обработка ошибок подключения
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
    })

    socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
    })

    socket.on('connect', () => {
      console.log('WebSocket connected successfully')
    })

    // Очистка при размонтировании или при выходе пользователя
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [queryClient, user])

  return socketRef.current
}
