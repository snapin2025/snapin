import { io, Socket } from 'socket.io-client'
import { onAccessTokenChanged } from '@/shared/lib/auth/accessTokenEvents'

let socket: Socket | null = null
let socketToken: string | null = null
let tokenListenersBound = false

const createSocket = (accessToken: string) =>
  io('https://inctagram.work', {
    query: { accessToken },
    transports: ['websocket']
  })

const reconnectSocket = (nextToken: string | null) => {
  if (nextToken === socketToken) {
    return
  }

  socketToken = nextToken

  if (socket) {
    socket.disconnect()
    socket = null
  }

  if (nextToken) {
    socket = createSocket(nextToken)
  }
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
