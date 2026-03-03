'use client'

import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { messengerApi } from '@/entities/messenger/api/messenger'
import { subscribeToEvent } from '@/shared/socket/subscribeToEvent'
import { WS_EVENT } from '@/entities/messenger/model/constants'
import { useAuth } from '@/shared/lib'
import { MESSENGER_UNREAD_QUERY_KEY } from './queryKeys'

export const useMessengerUnreadCount = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const unreadCountQuery = useQuery({
    queryKey: MESSENGER_UNREAD_QUERY_KEY,
    queryFn: async () => {
      const response = await messengerApi.getDialogs({ pageSize: 1 })
      return response.notReadCount ?? 0
    },
    enabled: !!user,
    staleTime: Infinity,
    refetchOnWindowFocus: true
  })

  useEffect(() => {
    if (!user) return

    const refreshUnreadCount = () => {
      queryClient.invalidateQueries({ queryKey: MESSENGER_UNREAD_QUERY_KEY })
    }

    const unsubReceive = subscribeToEvent<unknown>(WS_EVENT.RECEIVE_MESSAGE, refreshUnreadCount)
    const unsubSend = subscribeToEvent<unknown>(WS_EVENT.MESSAGE_SEND, refreshUnreadCount)
    const unsubUpdate = subscribeToEvent<unknown>(WS_EVENT.UPDATE_MESSAGE, refreshUnreadCount)
    const unsubDelete = subscribeToEvent<unknown>(WS_EVENT.MESSAGE_DELETED, refreshUnreadCount)

    return () => {
      unsubReceive()
      unsubSend()
      unsubUpdate()
      unsubDelete()
    }
  }, [queryClient, user])

  return {
    unreadCount: unreadCountQuery.data ?? 0,
    isLoading: unreadCountQuery.isPending
  }
}
