'use client'

import { useCallback } from 'react'
import { emitSendMessage } from '@/entities/messenger/api/messenger-socket'

export const useSendMessage = () => {
  const sendMessage = useCallback((receiverId: number, message: string) => {
    return emitSendMessage({ message, receiverId })
  }, [])

  return { sendMessage }
}
