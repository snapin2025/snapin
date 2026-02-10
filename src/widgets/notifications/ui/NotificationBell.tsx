'use client'

import { useRef, useState, useCallback } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Bell } from '@/shared/ui/icons'
import { useInfiniteScroll } from '@/shared/lib/hooks/useInfiniteScroll'
import { getTimeDifference } from '@/shared/lib/getTimeDifference'
import { clsx } from 'clsx'
import s from './NotificationBell.module.css'
import { useNotifications } from '@/entities/notification/model/useNotifications'

export const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const observerTargetRef = useRef<HTMLDivElement>(null)

  const { notifications, unreadCount, isLoading, markAsRead, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useNotifications()

  // Мемоизируем обработчик клика
  const handleNotificationClick = useCallback(
    (notificationId: number, isRead: boolean) => {
      markAsRead(notificationId, isRead)
    },
    [markAsRead]
  )

  // Настраиваем infinite scroll
  useInfiniteScroll({
    targetRef: observerTargetRef,
    rootRef: listRef,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage: () => {
      void fetchNextPage()
    },
    enabled: open,
    threshold: 0.5,
    rootMargin: '50px'
  })

  // Форматируем счетчик
  const formattedUnreadCount = unreadCount > 99 ? '99+' : unreadCount

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenu.Trigger asChild>
        <button className={s.trigger} aria-label="Уведомления">
          <Bell className={s.icon} />
          {unreadCount > 0 && (
            <span className={s.badge} aria-label={`${unreadCount} непрочитанных уведомлений`}>
              {formattedUnreadCount}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className={s.content} side="bottom" align="end" sideOffset={8} avoidCollisions={false}>
          <div className={s.header}>
            <DropdownMenu.Label className={s.title}>Уведомления</DropdownMenu.Label>
            {unreadCount > 0 && <span className={s.unreadCounter}>{formattedUnreadCount} новых</span>}
          </div>

          <div className={s.list} ref={listRef}>
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
                    aria-label={`Уведомление: ${notification.message}. ${notification.isRead ? 'Прочитано' : 'Не прочитано'}`}
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
                    <span className={s.itemTime}>
                      {getTimeDifference(notification.notifyAt ?? notification.createdAt, 'ru')}
                    </span>
                  </div>
                ))}
                {hasNextPage && (
                  <div
                    ref={observerTargetRef}
                    className={s.fetchMoreTrigger}
                    aria-live="polite"
                    aria-busy={isFetchingNextPage}
                  >
                    {isFetchingNextPage && <span className={s.loadingText}>Загрузка...</span>}
                  </div>
                )}
              </>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
