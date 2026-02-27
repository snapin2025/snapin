'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Input, Typography, Avatar, Spinner, Button } from '@/shared/ui'
import { useDialogs } from '@/entities/messenger/model/useDialogs'
import type { Dialog } from '@/entities/messenger'
import s from './DialogsList.module.css'
import { useAuth } from '@/shared/lib'

type Props = {
  selectedPartnerId: number | null
  onSelectPartner: (partnerId: number, dialog: Dialog) => void
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()

  const isSameDay = date.toDateString() === now.toDateString()
  const isSameYear = date.getFullYear() === now.getFullYear()

  if (isSameDay) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    ...(isSameYear ? {} : { year: 'numeric' })
  })
}

export const DialogsList = ({ selectedPartnerId, onSelectPartner }: Props) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const { user } = useAuth()
  const myId = user?.userId ?? 0

  const { dialogs, isLoading, fetchNextPage, hasNextPage } = useDialogs(debouncedSearch)

  const getPartnerId = useCallback((d: Dialog) => (d.ownerId === myId ? d.receiverId : d.ownerId), [myId])
  const isFromMe = (d: Dialog) => d.ownerId === myId
  const getPreview = (d: Dialog) => (isFromMe(d) ? `You: ${d.messageText}` : d.messageText)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  // Автовыбор диалога при открытии по параметру ?partner=
  const initializedRef = useRef(false)
  useEffect(() => {
    if (initializedRef.current) return
    if (!selectedPartnerId || !dialogs.length) return

    const dialog = dialogs.find((d) => getPartnerId(d) === selectedPartnerId)
    if (!dialog) return

    initializedRef.current = true
    onSelectPartner(selectedPartnerId, dialog)
  }, [selectedPartnerId, dialogs, onSelectPartner, getPartnerId])

  if (isLoading) {
    return (
      <div className={s.container}>
        <div className={s.searchWrapper}>
          <Input
            type="search"
            placeholder="Input search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled
          />
        </div>
        <div className={s.loading}>
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div className={s.container}>
      <div className={s.searchWrapper}>
        <Input type="search" placeholder="Input search" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className={s.list}>
        {dialogs.map((dialog) => {
          const partnerId = getPartnerId(dialog)
          const isSelected = selectedPartnerId === partnerId
          const avatarUrl = dialog.avatars?.[0]?.url
          const displayName = dialog.userName || `User ${partnerId}`

          return (
            <button
              key={`${partnerId}-${dialog.id}`}
              type="button"
              className={`${s.dialogItem} ${isSelected ? s.selected : ''}`}
              onClick={() => {
                // Выбираем диалог. Статусы сообщений и notReadCount
                // теперь обновляются в useMessages при открытии чата.
                onSelectPartner(partnerId, dialog)
              }}
            >
              <Avatar src={avatarUrl} alt={displayName} size="small" />
              <div className={s.dialogContent}>
                <Typography variant="regular_14" color="light" className={s.dialogName}>
                  {displayName}
                </Typography>
                <Typography color="light" className={s.dialogPreview}>
                  {getPreview(dialog)}
                </Typography>
              </div>
              <div className={s.dialogMeta}>
                <Typography color="light">{formatTime(dialog.createdAt)}</Typography>
                {dialog.notReadCount > 0 && <span className={s.badge}>{dialog.notReadCount}</span>}
              </div>
            </button>
          )
        })}
        {hasNextPage && (
          <Button type="button" className={s.loadMore} onClick={() => fetchNextPage()}>
            <Typography variant="regular_14" color="light">
              Load more
            </Typography>
          </Button>
        )}
      </div>
    </div>
  )
}
