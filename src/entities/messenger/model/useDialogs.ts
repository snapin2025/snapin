'use client'

import { useEffect, useMemo } from 'react'
import type { InfiniteData } from '@tanstack/react-query'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { messengerApi } from '@/entities/messenger/api/messenger'
import { subscribeToEvent } from '@/shared/socket/subscribeToEvent'
import { WS_EVENT } from '@/entities/messenger/model/constants'
import type { Dialog, DialogsResponse, DialogMessage } from '@/entities/messenger/api/messenger-types'
import { useAuth } from '@/shared/lib'

const PAGE_SIZE = 12
const QUERY_KEY = ['messenger', 'dialogs'] as const

type Cache = InfiniteData<DialogsResponse, number | undefined>

const getPartnerId = (d: Dialog | DialogMessage, myId: number) => (d.ownerId === myId ? d.receiverId : d.ownerId)

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

const messageToDialog = (msg: DialogMessage, existing?: Dialog): Dialog => ({
  ...msg,
  userName: existing?.userName ?? '',
  avatars: existing?.avatars ?? [],
  notReadCount: existing ? existing.notReadCount : 0
})

export const useDialogs = (searchName?: string) => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const myId = user?.userId ?? 0
  const dialogsQueryKey = useMemo(() => [...QUERY_KEY, searchName ?? ''] as const, [searchName])

  // ---------- QUERY ----------
  const query = useInfiniteQuery({
    queryKey: dialogsQueryKey,
    queryFn: ({ pageParam = null }) =>
      messengerApi.getDialogs({
        cursor: pageParam ?? undefined,
        pageSize: PAGE_SIZE,
        searchName: searchName || undefined
      }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) =>
      lastPage.items.length < PAGE_SIZE ? undefined : (lastPage.items.at(-1)?.id ?? undefined),
    staleTime: Infinity,
    refetchOnWindowFocus: false
  })

  // ---------- FLAT (dedupe by conversation partner) ----------
  const dialogs = useMemo(() => {
    const pages = query.data?.pages ?? []
    const globalNotReadCount = pages[0]?.notReadCount ?? 0
    const map = new Map<number, Dialog>()
    for (const page of pages) {
      for (const d of page.items) {
        const partnerId = getPartnerId(d, myId)
        if (!Number.isFinite(partnerId)) continue

        const existing = map.get(partnerId)
        if (!existing || new Date(d.createdAt) > new Date(existing.createdAt)) {
          // Нормализуем notReadCount диалога: он не может быть больше,
          // чем общий notReadCount, который пришёл в ответе сервера.
          const normalized: Dialog = {
            ...d,
            notReadCount: typeof d.notReadCount === 'number' ? Math.min(d.notReadCount, globalNotReadCount) : 0
          }
          map.set(partnerId, normalized)
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [query.data, myId])

  // ---------- SOCKET: RECEIVE_MESSAGE & MESSAGE_SEND ----------
  useEffect(() => {
    if (!myId) return

    const handleMessage = (payload: unknown) => {
      const msg = extractDialogMessage(payload)
      if (!msg) return

      const partnerId = getPartnerId(msg, myId)
      if (!Number.isFinite(partnerId)) return

      const hasSearchFilter = Boolean(searchName?.trim())
      if (hasSearchFilter) {
        const currentData = queryClient.getQueryData<Cache>(dialogsQueryKey)
        const existsInCurrentList = currentData?.pages[0]?.items.some((d) => getPartnerId(d, myId) === partnerId)
        if (!existsInCurrentList) {
          queryClient.invalidateQueries({ queryKey: dialogsQueryKey })
          return
        }
      }

      queryClient.setQueryData<Cache>(dialogsQueryKey, (old) => {
        if (!old?.pages.length) return old

        const first = old.pages[0]
        const existing = first.items.find((d) => getPartnerId(d, myId) === partnerId)
        if (hasSearchFilter && !existing) return old

        const newDialog = messageToDialog(msg, existing)
        const isFromPartner = msg.ownerId !== myId
        if (isFromPartner && existing) {
          newDialog.notReadCount = (existing.notReadCount ?? 0) + 1
        }

        const rest = first.items.filter((d) => getPartnerId(d, myId) !== partnerId)
        const updatedFirst = {
          ...first,
          items: [newDialog, ...rest],
          totalCount: existing ? first.totalCount : first.totalCount + 1,
          notReadCount: isFromPartner ? first.notReadCount + 1 : first.notReadCount
        }

        return {
          ...old,
          pages: [updatedFirst, ...old.pages.slice(1)]
        }
      })
    }

    const unsubReceive = subscribeToEvent<unknown>(WS_EVENT.RECEIVE_MESSAGE, handleMessage)
    const unsubSend = subscribeToEvent<unknown>(WS_EVENT.MESSAGE_SEND, handleMessage)

    return () => {
      unsubReceive()
      unsubSend()
    }
  }, [queryClient, dialogsQueryKey, myId, searchName])

  // ---------- RETURN ----------
  return {
    dialogs,
    isLoading: query.isPending,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage
  }
}
