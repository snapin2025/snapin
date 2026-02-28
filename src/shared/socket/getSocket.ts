import { io, Socket } from 'socket.io-client'
import axios from 'axios'
import { emitAccessTokenChanged, onAccessTokenChanged } from '@/shared/lib/auth/accessTokenEvents'

let socket: Socket | null = null
let socketToken: string | null = null
let tokenListenersBound = false
let refreshPromise: Promise<string | null> | null = null

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://inctagram.work'
const API_URL = process.env.NEXT_PUBLIC_API_URL

const isAuthErrorPayload = (payload: unknown) => {
  if (!payload) return false
  let serialized = ''
  try {
    serialized = JSON.stringify(payload)
  } catch {
    serialized = String(payload)
  }
  const normalized = serialized.toUpperCase()
  return normalized.includes('AUTH_ERROR') || normalized.includes('AUTHENTICATION ERROR')
}

const refreshAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined' || !API_URL) {
    return null
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${API_URL}/auth/update`,
        {},
        {
          withCredentials: true
        }
      )
      .then((response) => {
        const nextToken = typeof response.data?.accessToken === 'string' ? response.data.accessToken : null
        if (!nextToken) return null

        localStorage.setItem('accessToken', nextToken)
        emitAccessTokenChanged(nextToken)
        return nextToken
      })
      .catch(() => {
        localStorage.removeItem('accessToken')
        emitAccessTokenChanged(null)
        return null
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

const createSocket = (accessToken: string) => {
  const createdSocket = io(SOCKET_URL, {
    query: { accessToken },
    transports: ['websocket']
  })

  const handleAuthError = async (payload: unknown) => {
    if (!isAuthErrorPayload(payload)) return

    const nextToken = await refreshAccessToken()
    if (!nextToken) return
    reconnectSocket(nextToken)
  }

  createdSocket.on('connect_error', handleAuthError)
  createdSocket.on('error', handleAuthError)
  createdSocket.on('exception', handleAuthError)

  return createdSocket
}

const reconnectSocket = (nextToken: string | null) => {
  if (!socket) {
    socketToken = nextToken
    if (nextToken) {
      socket = createSocket(nextToken)
    }
    return
  }

  if (nextToken === socketToken) {
    if (nextToken && !socket.connected) {
      socket.connect()
    }
    if (!nextToken && socket.connected) {
      socket.disconnect()
    }
    return
  }

  socketToken = nextToken

  if (!nextToken) {
    socket.disconnect()
    return
  }

  socket.io.opts.query = {
    ...(socket.io.opts.query ?? {}),
    accessToken: nextToken
  }

  if (socket.connected) {
    socket.disconnect()
  }

  socket.connect()
}

const bindTokenListeners = () => {
  if (tokenListenersBound || typeof window === 'undefined') {
    return
  }

  tokenListenersBound = true

  window.addEventListener('storage', (event) => {
    if (event.key === 'accessToken') {
      reconnectSocket(event.newValue)
    }
  })

  onAccessTokenChanged((accessToken) => {
    reconnectSocket(accessToken)
  })
}

export const getSocket = (): Socket | null => {
  if (!socket) {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    socketToken = accessToken
    if (accessToken) {
      socket = createSocket(accessToken)
    }
  }

  bindTokenListeners()

  return socket
}
