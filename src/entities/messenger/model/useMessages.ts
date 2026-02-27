'use client'

import { useEffect, useMemo } from 'react'
import type { InfiniteData } from '@tanstack/react-query'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { DialogMessagesResponse, DialogMessage, DialogsResponse } from '@/entities/messenger'
import { subscribeToEvent } from '@/shared/socket/subscribeToEvent'
import { subscribeToMessageSendWithAck } from '@/entities/messenger/api/messenger-socket'
import { messengerApi } from '@/entities/messenger/api/messenger'
import { WS_EVENT } from '@/entities/messenger/model/constants'
import { useAuth } from '@/shared/lib'
import { MESSENGER_DIALOGS_QUERY_KEY, MESSENGER_UNREAD_QUERY_KEY } from './queryKeys'

const PAGE_SIZE = 12

const key = (id: number) => ['messages', id] as const

type Cache = InfiniteData<DialogMessagesResponse, number | null>
type DialogsCache = InfiniteData<DialogsResponse, number | null | undefined>

const isDialogMessage = (payload: unknown): payload is DialogMessage => {
  if (!payload || typeof payload !== 'object') return false

  const candidate = payload as Partial<DialogMessage>
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.ownerId === 'number' &&
    typeof candidate.receiverId === 'number' &&
    typeof candidate.messageText === 'string'
  )
}

const extractDialogMessage = (payload: unknown): DialogMessage | null => {
  if (isDialogMessage(payload)) return payload
  if (!payload || typeof payload !== 'object' || !('message' in payload)) return null

  const maybeMessage = (payload as { message?: unknown }).message
  return isDialogMessage(maybeMessage) ? maybeMessage : null
}

const isMessageInDialog = (msg: DialogMessage, partnerId: number) =>
  msg.ownerId === partnerId || msg.receiverId === partnerId

export const useMessages = (dialoguePartnerId: number) => {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => key(dialoguePartnerId), [dialoguePartnerId])
  const { user } = useAuth()
  const myId = user?.userId ?? 0

  const { mutate: markMessagesRead } = useMutation({
    mutationFn: (ids: number[]) => messengerApi.updateStatus({ ids }),
    onMutate: async (ids) => {
      if (!ids.length) return
      const idSet = new Set(ids)

      queryClient.setQueryData<Cache>(queryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((message) => (idSet.has(message.id) ? { ...message, status: 'READ' } : message))
          }))
        }
      })

      queryClient.setQueriesData<DialogsCache>({ queryKey: MESSENGER_DIALOGS_QUERY_KEY }, (old) => {
        if (!old?.pages.length) return old

        let isTargetDialogProcessed = false
        let removedUnreadCount = 0

        const pages = old.pages.map((page) => ({
          ...page,
          items: page.items.map((dialog) => {
            const partnerId = dialog.ownerId === myId ? dialog.receiverId : dialog.ownerId
            if (partnerId !== dialoguePartnerId) return dialog
            if (!isTargetDialogProcessed) {
              isTargetDialogProcessed = true
              removedUnreadCount = Math.max(0, dialog.notReadCount ?? 0)
            }
            return dialog.notReadCount > 0 ? { ...dialog, notReadCount: 0 } : dialog
          })
        }))

        if (removedUnreadCount === 0) {
          return {
            ...old,
            pages
          }
        }

        const first = pages[0]
        pages[0] = {
          ...first,
          notReadCount: Math.max(0, first.notReadCount - removedUnreadCount)
        }

        return {
          ...old,
          pages
        }
      })

      queryClient.setQueryData<number>(MESSENGER_UNREAD_QUERY_KEY, (oldValue) =>
        Math.max(0, (oldValue ?? 0) - ids.length)
      )
    },
    onSuccess: (_, ids) => {
      if (!ids.length) return

      void queryClient.invalidateQueries({ queryKey, exact: true })
      void queryClient.invalidateQueries({ queryKey: MESSENGER_DIALOGS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: MESSENGER_UNREAD_QUERY_KEY })
    }
  })

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
    refetchOnMount: 'always',
    refetchOnWindowFocus: false
  })

  // ---------- SOCKET ----------
  useEffect(() => {
    if (!dialoguePartnerId) return

    const addMessageToCache = (msg: DialogMessage) => {
      queryClient.setQueryData<Cache>(queryKey, (old) => {
        if (!old?.pages?.length) return old

        let exists = false
        const pagesWithUpdate = old.pages.map((page) => {
          let hasUpdate = false
          const updatedItems = page.items.map((message) => {
            if (message.id !== msg.id) return message
            exists = true
            hasUpdate = true
            return msg
          })

          return hasUpdate ? { ...page, items: updatedItems } : page
        })

        if (exists) {
          return {
            ...old,
            pages: pagesWithUpdate
          }
        }

        const first = pagesWithUpdate[0]

        return {
          ...old,
          pages: [
            {
              ...first,
              items: [msg, ...first.items],
              totalCount: first.totalCount + 1
            },
            ...pagesWithUpdate.slice(1)
          ]
        }
      })
    }

    // RECEIVE_MESSAGE: sender gets saved message, or updated status after ack
    const unsubReceive = subscribeToEvent<unknown>(WS_EVENT.RECEIVE_MESSAGE, (payload) => {
      const msg = extractDialogMessage(payload)
      if (!msg) return
      if (!isMessageInDialog(msg, dialoguePartnerId)) return
      addMessageToCache(msg)
    })

    // MESSAGE_SEND: recipient receives - must acknowledge with callback({message, receiverId})
    const unsubSend = subscribeToMessageSendWithAck((msg, ack) => {
      if (!isDialogMessage(msg)) return
      if (!isMessageInDialog(msg, dialoguePartnerId)) return
      addMessageToCache(msg)
      ack({ message: msg, receiverId: myId })
    })

    // UPDATE_MESSAGE: message updated
    const unsubUpdate = subscribeToEvent<unknown>(WS_EVENT.UPDATE_MESSAGE, (payload) => {
      const updated = extractDialogMessage(payload)
      if (!updated) return

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

  // ---------- FLAT (chronological ascending: oldest -> newest) ----------
  const messages = (query.data?.pages.flatMap((p) => p.items) ?? []).slice().sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  })

  // ---------- MARK AS READ ----------
  useEffect(() => {
    if (!dialoguePartnerId || !myId) return

    const unreadIds = messages
      .filter(
        (message) => message.ownerId === dialoguePartnerId && message.receiverId === myId && message.status !== 'READ'
      )
      .map((message) => message.id)

    if (!unreadIds.length) return
    markMessagesRead(unreadIds)
  }, [dialoguePartnerId, myId, messages, markMessagesRead])

  return {
    messages,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isLoading: query.isPending,
    isFetchingNextPage: query.isFetchingNextPage
  }
}
