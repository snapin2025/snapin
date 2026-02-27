'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { messengerApi } from '@/entities/messenger/api/messenger'

const MESSAGES_KEY = ['messages'] as const

export const useDeleteMessage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => messengerApi.deleteMessage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: MESSAGES_KEY })
    }
  })
}
