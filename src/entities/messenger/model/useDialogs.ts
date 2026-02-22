'use client'

import { useEffect, useMemo, useCallback, useRef } from 'react'
import type { InfiniteData } from '@tanstack/react-query'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messengerApi } from '@/entities/messenger/api/messenger'
import { subscribeToEvent } from '@/shared/socket/subscribeToEvent'
import { WS_EVENT } from '@/entities/messenger/model/constants'
import type { Dialog, DialogsResponse, DialogMessage } from '@/entities/messenger/api/messenger-types'
import { useAuth } from '@/shared/lib'

const PAGE_SIZE = 12
const QUERY_KEY = ['messenger', 'dialogs'] as const

type Cache = InfiniteData<DialogsResponse, number | undefined>

const getPartnerId = (d: Dialog | DialogMessage, myId: number) => (d.ownerId === myId ? d.receiverId : d.ownerId)

const messageToDialog = (msg: DialogMessage, existing?: Dialog): Dialog => ({
  ...msg,
  userName: existing?.userName ?? '',
  avatars: existing?.avatars ?? [],
  notReadCount: existing ? existing.notReadCount : 0
})

export const useDialogs = (searchName?: string) => {
  const queryClient = useQueryClient()
  const subscribedRef = useRef(false)
  const { user } = useAuth()
  const myId = user?.userId ?? 0

  // ---------- QUERY ----------
  const query = useInfiniteQuery({
    queryKey: [...QUERY_KEY, searchName ?? ''] as const,
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

  // ---------- MUTATION ----------
  const markReadMutation = useMutation({
    mutationFn: (ids: number[]) => messengerApi.updateStatus({ ids }),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })

      const prev = queryClient.getQueryData<Cache>(QUERY_KEY)
      const idSet = new Set(ids)

      queryClient.setQueryData<Cache>(QUERY_KEY, (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((d) => (idSet.has(d.id) ? { ...d, notReadCount: 0 } : d))
          }))
        }
      })

      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(QUERY_KEY, ctx.prev)
    }
  })

  // ---------- FLAT (dedupe by conversation partner) ----------
  const dialogs = useMemo(() => {
    const pages = query.data?.pages ?? []
    const map = new Map<number, Dialog>()
    for (const page of pages) {
      for (const d of page.items) {
        const partnerId = getPartnerId(d, myId)
        const existing = map.get(partnerId)
        if (!existing || new Date(d.createdAt) > new Date(existing.createdAt)) {
          map.set(partnerId, d)
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [query.data, myId])

  // ---------- API ----------
  const markDialogRead = useCallback((messageIds: number[]) => markReadMutation.mutate(messageIds), [markReadMutation])

  // ---------- SOCKET: RECEIVE_MESSAGE & MESSAGE_SEND ----------
  useEffect(() => {
    if (!myId || subscribedRef.current) return
    subscribedRef.current = true

    const handleMessage = (msg: DialogMessage) => {
      queryClient.setQueriesData<Cache>({ queryKey: ['messenger', 'dialogs'] }, (old) => {
        if (!old?.pages.length) return old

        const first = old.pages[0]
        const partnerId = getPartnerId(msg, myId)
        const existing = first.items.find((d) => getPartnerId(d, myId) === partnerId)

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

    const unsubReceive = subscribeToEvent<DialogMessage>(WS_EVENT.RECEIVE_MESSAGE, handleMessage)
    const unsubSend = subscribeToEvent<DialogMessage>(WS_EVENT.MESSAGE_SEND, handleMessage)

    return () => {
      unsubReceive()
      unsubSend()
      subscribedRef.current = false
    }
  }, [queryClient, myId])

  // ---------- RETURN ----------
  return {
    dialogs,
    isLoading: query.isPending,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    markDialogRead
  }
}
