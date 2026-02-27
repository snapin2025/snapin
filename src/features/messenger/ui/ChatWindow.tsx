'use client'

import { useState, useRef, useEffect } from 'react'
import { Typography, Avatar, Button, Input, Spinner } from '@/shared/ui'
import { useMessages } from '@/entities/messenger/model/useMessages'
import { useSendMessage } from '@/features/messenger/api/useSendMessage'
import type { DialogMessage } from '@/entities/messenger'
import { useDeleteMessage } from '@/features/messenger/api/useDeleteMessage'
import s from './ChatWindow.module.css'
import { useAuth } from '@/shared/lib'

type Props = {
  partnerId: number | null
  partnerName?: string
  partnerAvatar?: string
}

const formatMessageTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

export const ChatWindow = ({ partnerId, partnerName, partnerAvatar }: Props) => {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastMessageIdRef = useRef<number | null>(null)
  const { user } = useAuth()
  const myId = user?.userId ?? 0

  const { messages, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessages(partnerId ?? 0)
  const { sendMessage } = useSendMessage()
  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage()

  useEffect(() => {
    lastMessageIdRef.current = null
  }, [partnerId])

  useEffect(() => {
    const lastMessageId = messages.at(-1)?.id ?? null
    const shouldScroll = lastMessageIdRef.current === null || lastMessageId !== lastMessageIdRef.current

    if (shouldScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    lastMessageIdRef.current = lastMessageId
  }, [messages])

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text || !partnerId) return
    sendMessage(partnerId, text)
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!partnerId) {
    return (
      <div className={s.container}>
        <div className={s.empty}>
          <Typography variant="regular_16" color="light">
            Select a conversation
          </Typography>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.headerInfo}>
            {partnerAvatar && <Avatar src={partnerAvatar} alt={partnerName || `User ${partnerId}`} size="small" />}
            <Typography variant="h3" color="light">
              {partnerName || `User ${partnerId}`}
            </Typography>
          </div>
        </div>
        <div className={s.loading}>
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.headerInfo}>
          {partnerAvatar && <Avatar src={partnerAvatar} alt={partnerName || `User ${partnerId}`} size="small" />}
          <Typography variant="h3" color="light">
            {partnerName || `User ${partnerId}`}
          </Typography>
        </div>
      </div>

      <div className={s.messagesWrapper}>
        {hasNextPage && (
          <div className={s.loadMoreWrapper}>
            <Button variant="textButton" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? 'Loading...' : 'Load older messages'}
            </Button>
          </div>
        )}

        <div className={s.messages}>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.ownerId === myId}
              partnerAvatar={partnerAvatar}
              onDelete={() => deleteMessage(msg.id)}
              disableActions={isDeleting}
            />
          ))}
        </div>

        <div ref={messagesEndRef} />
      </div>

      <div className={s.inputSection}>
        <Input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="primary" onClick={handleSend} disabled={!inputValue.trim()}>
          Send message
        </Button>
      </div>
    </div>
  )
}

type MessageBubbleProps = {
  message: DialogMessage
  isOwn: boolean
  partnerAvatar?: string
  onDelete?: () => void
  disableActions?: boolean
}

const MessageBubble = ({ message, isOwn, partnerAvatar, onDelete, disableActions }: MessageBubbleProps) => (
  <div className={`${s.messageRow} ${isOwn ? s.own : s.other}`}>
    {!isOwn && (
      <div className={s.messageAvatar}>
        <Avatar src={partnerAvatar} alt="Avatar" size="very_small" />
      </div>
    )}
    <div className={`${s.bubble} ${isOwn ? s.bubbleOwn : s.bubbleOther}`}>
      <Typography variant="regular_14" color="light">
        {message.messageText}
      </Typography>
      <div className={s.meta}>
        <Typography color="light" className={s.time}>
          {formatMessageTime(message.createdAt)}
          {/* Показываем чек, когда сообщение реально прочитано собеседником */}
          {isOwn && message.status === 'READ' && ' ✓'}
        </Typography>
        {isOwn && onDelete && (
          <button
            type="button"
            className={s.iconButton}
            disabled={disableActions}
            aria-label="Delete message"
            onClick={onDelete}
          >
            🗑
          </button>
        )}
      </div>
    </div>
  </div>
)
