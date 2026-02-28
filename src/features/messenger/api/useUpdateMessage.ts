'use client'

import { useCallback } from 'react'
import { emitUpdateMessage } from '@/entities/messenger/api/messenger-socket'

export const useUpdateMessage = () => {
  const updateMessage = useCallback((id: number, message: string) => {
    return emitUpdateMessage({ id, message })
  }, [])

  return { updateMessage }
}
