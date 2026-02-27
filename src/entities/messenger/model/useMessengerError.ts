'use client'

import { useEffect } from 'react'
import { subscribeToEvent } from '@/shared/socket/subscribeToEvent'
import { WS_EVENT } from './constants'
import type { MessengerError } from '../api/messenger-types'

const formatError = (err: unknown): MessengerError => {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = (err as { message?: unknown }).message
    const error = (err as { error?: unknown }).error
    return {
      message: typeof msg === 'string' ? msg : String(msg ?? 'Unknown error'),
      error: typeof error === 'string' ? error : error != null ? String(error) : ''
    }
  }
  return { message: String(err ?? 'Unknown error'), error: '' }
}

export const useMessengerError = (onError?: (err: MessengerError) => void) => {
  useEffect(() => {
    const unsub = subscribeToEvent<unknown>(WS_EVENT.ERROR, (payload) => {
      const err = formatError(payload)
      if (process.env.NODE_ENV === 'development' && err.message !== 'Authentication error') {
        console.warn('[Messenger]', err.error || err.message)
      }
      onError?.(err)
    })
    return unsub
  }, [onError])
}
