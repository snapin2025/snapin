'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Typography } from '@/shared/ui'
import { DialogsList } from '@/features/messenger/ui/DialogsList'
import { ChatWindow } from '@/features/messenger/ui/ChatWindow'
import { useMessengerError } from '@/entities/messenger/model/useMessengerError'
import type { Dialog } from '@/entities/messenger'
import s from './messengerPage.module.css'
import { useAuth } from '@/shared/lib'

export const MessengerPage = () => {
  const searchParams = useSearchParams()
  const partnerIdParam = searchParams?.get('partner')
  const initialPartnerId = partnerIdParam ? parseInt(partnerIdParam, 10) : null

  const [selectedPartner, setSelectedPartner] = useState<{
    id: number
    name: string
    avatar?: string
  } | null>(initialPartnerId ? { id: initialPartnerId, name: `User ${initialPartnerId}` } : null)

  const { user } = useAuth()

  useMessengerError()

  const handleSelectPartner = useCallback((partnerId: number, dialog: Dialog) => {
    const partnerName = dialog.userName || `User ${partnerId}`
    const avatarUrl = dialog.avatars?.[0]?.url

    setSelectedPartner({
      id: partnerId,
      name: partnerName,
      avatar: avatarUrl
    })

    const url = new URL(window.location.href)
    url.searchParams.set('partner', String(partnerId))
    window.history.replaceState({}, '', url.toString())
  }, [])

  if (!user) {
    return (
      <div className={s.wrapper}>
        <Typography variant="regular_16" color="light">
          Please sign in to use Messenger
        </Typography>
      </div>
    )
  }

  return (
    <div className={s.wrapper}>
      <Typography variant="h1" color="light" className={s.title}>
        Messenger
      </Typography>

      <div className={s.layout}>
        <DialogsList selectedPartnerId={selectedPartner?.id ?? null} onSelectPartner={handleSelectPartner} />
        <ChatWindow
          partnerId={selectedPartner?.id ?? null}
          partnerName={selectedPartner?.name}
          partnerAvatar={selectedPartner?.avatar}
        />
      </div>
    </div>
  )
}
