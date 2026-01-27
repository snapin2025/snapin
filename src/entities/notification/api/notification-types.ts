import type { ISOStringFormat } from 'date-fns'

// === Типы для API ===

export type Notification = {
  id: number
  message: string
  isRead: boolean
  createdAt: ISOStringFormat
}

export type NotificationsResponse = {
  items: Notification[]
  pageSize: number
  totalCount: number
  notReadCount: number
}

export type NotificationsQueryParams = {
  pageSize?: number
  sortDirection?: 'asc' | 'desc'
}

// === WebSocket ===

export const SOCKET_EVENTS = {
  NOTIFICATIONS: 'notifications'
} as const

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS]

export type NewNotification = {
  id: number
  message: string
  isRead: boolean
  createdAt: ISOStringFormat
}
