'use client'

import { useState, useCallback } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Bell } from '@/shared/ui/icons'
import { useNotificationsList, useMarkNotificationAsRead } from '@/entities/notification/model/useNotifications'
import { getTimeDifference } from '@/shared/lib/getTimeDifference'
import { clsx } from 'clsx'
import s from './NotificationBell.module.css'

export const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage
  } = useNotificationsList()
  const markAsRead = useMarkNotificationAsRead()

  // Отслеживаем скролл списка
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight

      // Загружаем следующую страницу когда до конца осталось менее 100px
      if (scrollBottom < 100 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  )

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

          <div className={s.list} onScroll={handleScroll}>
            {isLoading ? (
              <div className={s.empty}>Загрузка...</div>
            ) : notifications.length === 0 ? (
              <div className={s.empty}>Нет уведомлений</div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={clsx(s.item, !notification.isRead && s.itemUnread)}
                    onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleNotificationClick(notification.id, notification.isRead)
                      }
                    }}
                  >
                    <div className={s.itemHeader}>
                      <span className={s.itemTitle}>Новое уведомление!</span>
                      {!notification.isRead && <span className={s.newBadge}>Новое</span>}
                    </div>
                    <p className={s.itemMessage}>{notification.message}</p>
                    <span className={s.itemTime}>{getTimeDifference(notification.createdAt, 'ru')}</span>
                  </div>
                ))}
                {/* Индикатор загрузки */}
                {isFetchingNextPage && (
                  <div className={s.observerTarget}>
                    <div className={s.loading}>Загрузка...</div>
                  </div>
                )}
                {/* Индикатор конца списка */}
                {!hasNextPage && notifications.length > 0 && (
                  <div className={s.endOfList}>Все уведомления загружены</div>
                )}
              </>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
