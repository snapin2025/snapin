import { Notification } from './notification-types'

const NOTIFICATIONS_STORAGE_KEY = 'notifications'

/**
 * Утилиты для работы с уведомлениями в localStorage
 */
export const notificationStorage = {
  /**
   * Получить все уведомления из localStorage
   */
  getNotifications: (): Notification[] => {
    if (typeof window === 'undefined') {
      return []
    }

    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
      if (!stored) {
        return []
      }
      return JSON.parse(stored) as Notification[]
    } catch (error) {
      console.error('Error reading notifications from localStorage:', error)
      return []
    }
  },

  /**
   * Сохранить уведомления в localStorage
   */
  saveNotifications: (notifications: Notification[]): void => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      // Ограничиваем количество хранимых уведомлений (например, последние 100)
      const limitedNotifications = notifications.slice(0, 100)
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(limitedNotifications))
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error)
    }
  },

  /**
   * Отметить уведомление как прочитанное
   */
  markAsRead: (notificationId: number): void => {
    const notifications = notificationStorage.getNotifications()
    const updated = notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    notificationStorage.saveNotifications(updated)
  },

  /**
   * Отметить все уведомления как прочитанные
   */
  markAllAsRead: (): void => {
    const notifications = notificationStorage.getNotifications()
    const updated = notifications.map((n) => ({ ...n, isRead: true }))
    notificationStorage.saveNotifications(updated)
  }
}
