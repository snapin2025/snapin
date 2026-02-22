'use client'

import { useEffect } from 'react'
import type { InfiniteData } from '@tanstack/react-query'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import type { DialogMessagesResponse, DialogMessage } from '../api/messenger-types'
import { subscribeToEvent } from '@/shared/socket/subscribeToEvent'
import { subscribeToMessageSendWithAck } from '@/entities/messenger/api/messenger-socket'
import { messengerApi } from '@/entities/messenger/api/messenger'
import { WS_EVENT } from '@/entities/messenger/model/constants'
import { useAuth } from '@/shared/lib'

const PAGE_SIZE = 12

const key = (id: number) => ['messages', id] as const

type Cache = InfiniteData<DialogMessagesResponse, number | null>

const isMessageInDialog = (msg: DialogMessage, partnerId: number) =>
  msg.ownerId === partnerId || msg.receiverId === partnerId

export const useMessages = (dialoguePartnerId: number) => {
  const queryClient = useQueryClient()
  const queryKey = key(dialoguePartnerId)
  const { user } = useAuth()
  const myId = user?.userId ?? 0

  // ---------- API ----------
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) =>
      messengerApi.getMessages({
        dialoguePartnerId,
        cursor: pageParam ?? undefined,
        pageSize: PAGE_SIZE
      }),

    initialPageParam: null as number | null,

    getNextPageParam: (last) => (last.items.length < PAGE_SIZE ? undefined : last.items.at(-1)?.id),

    enabled: !!dialoguePartnerId,
    staleTime: Infinity,
    refetchOnWindowFocus: false
  })

  // ---------- SOCKET ----------
  useEffect(() => {
    if (!dialoguePartnerId) return

    const addMessageToCache = (msg: DialogMessage) => {
      queryClient.setQueryData<Cache>(queryKey, (old) => {
        if (!old?.pages?.length) return old

        const exists = old.pages.some((p) => p.items.some((m) => m.id === msg.id))
        if (exists) return old

        const first = old.pages[0]

        return {
          ...old,
          pages: [
            {
              ...first,
              items: [msg, ...first.items],
              totalCount: first.totalCount + 1
            },
            ...old.pages.slice(1)
          ]
        }
      })
    }

    // RECEIVE_MESSAGE: sender gets saved message, or updated status after ack
    const unsubReceive = subscribeToEvent<DialogMessage>(WS_EVENT.RECEIVE_MESSAGE, (msg) => {
      if (!isMessageInDialog(msg, dialoguePartnerId)) return
      addMessageToCache(msg)
    })

    // MESSAGE_SEND: recipient receives - must acknowledge with callback({message, receiverId})
    const unsubSend = subscribeToMessageSendWithAck((msg, ack) => {
      if (!isMessageInDialog(msg, dialoguePartnerId)) return
      addMessageToCache(msg)
      ack({ message: msg, receiverId: myId })
    })

    // UPDATE_MESSAGE: message updated
    const unsubUpdate = subscribeToEvent<DialogMessage>(WS_EVENT.UPDATE_MESSAGE, (updated) => {
      queryClient.setQueryData<Cache>(queryKey, (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((m) => (m.id === updated.id ? updated : m))
          }))
        }
      })
    })

    // MESSAGE_DELETED: server returns id of deleted message
    const unsubDelete = subscribeToEvent<number | { id: number }>(WS_EVENT.MESSAGE_DELETED, (payload) => {
      const id = typeof payload === 'object' && payload !== null && 'id' in payload ? payload.id : payload
      queryClient.setQueryData<Cache>(queryKey, (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.filter((m) => m.id !== id),
            totalCount: Math.max(0, page.totalCount - 1)
          }))
        }
      })
    })

    return () => {
      unsubReceive()
      unsubSend()
      unsubUpdate()
      unsubDelete()
    }
  }, [dialoguePartnerId, queryClient, queryKey, myId])

  // ---------- FLAT ----------
  const messages = query.data?.pages.flatMap((p) => p.items) ?? []

  return {
    messages,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isLoading: query.isPending,
    isFetchingNextPage: query.isFetchingNextPage
  }
}
