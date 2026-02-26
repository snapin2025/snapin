'use client'

import { useState, useEffect, useRef } from 'react'
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
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))

  if (days === 0) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  if (days === 1) return 'Tue'
  if (days < 7) return `${days} ${date.toLocaleDateString('ru-RU', { month: 'short' })}`
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export const DialogsList = ({ selectedPartnerId, onSelectPartner }: Props) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const { user } = useAuth()
  const myId = user?.userId ?? 0

  const { dialogs, isLoading, fetchNextPage, hasNextPage, markDialogRead } = useDialogs(debouncedSearch)

  const getPartnerId = (d: Dialog) => (d.ownerId === myId ? d.receiverId : d.ownerId)
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
  }, [selectedPartnerId, dialogs, onSelectPartner])

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
                onSelectPartner(partnerId, dialog)
                if (dialog.notReadCount > 0) {
                  // Помечаем диалог как прочитанный (и на клиенте, и на сервере)
                  markDialogRead([dialog.id])
                }
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
