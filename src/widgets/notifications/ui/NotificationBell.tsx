'use client'

import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Bell } from '@/shared/ui/icons'
import {
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationAsRead
} from '@/entities/notification/model/useNotifications'
import { useNotificationsWebSocket } from '@/shared/lib/hooks/useNotificationsWebSocket'
import { getTimeDifference } from '@/shared/lib/getTimeDifference'
import { clsx } from 'clsx'
import s from './NotificationBell.module.css'

export const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const { data: notifications, isLoading } = useNotifications()
  const unreadCount = useUnreadNotificationsCount()
  const markAsRead = useMarkNotificationAsRead()

  // Убеждаемся, что notifications всегда массив
  const notificationsList = Array.isArray(notifications) ? notifications : []

  // Подключаемся к WebSocket для получения уведомлений в реальном времени
  useNotificationsWebSocket()


  const handleNotificationClick = (notificationId: number, isRead: boolean) => {
    if (!isRead) {
      markAsRead.mutate(notificationId)
    }
  }

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className={s.trigger} aria-label="Уведомления">
          <Bell className={s.icon} />
          {unreadCount > 0 && (
            <span className={s.badge} aria-label={`${unreadCount} непрочитанных уведомлений`}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={s.content} side="bottom" align="end" sideOffset={8} avoidCollisions={false}>
          <div className={s.header}>
            <DropdownMenu.Label className={s.title}>Уведомления</DropdownMenu.Label>
          </div>

          <div className={s.list}>
            {isLoading ? (
              <div className={s.empty}>Загрузка...</div>
            ) : notificationsList.length === 0 ? (
              <div className={s.empty}>Нет уведомлений</div>
            ) : (
              notificationsList.map((notification) => (
                <DropdownMenu.Item
                  key={notification.id}
                  className={clsx(s.item, !notification.isRead && s.itemUnread)}
                  onSelect={() => handleNotificationClick(notification.id, notification.isRead)}
                >
                  <div className={s.itemHeader}>
                    <span className={s.itemTitle}>Новое уведомление!</span>
                    {!notification.isRead && <span className={s.newBadge}>Новое</span>}
                  </div>
                  <p className={s.itemMessage}>{notification.message}</p>
                  <span className={s.itemTime}>{getTimeDifference(notification.notifyAt, 'ru')}</span>
                </DropdownMenu.Item>
              ))
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
