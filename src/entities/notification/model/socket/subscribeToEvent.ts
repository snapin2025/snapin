import { getSocket } from '@/entities/notification/model/socket/getSocket'
import { SocketEvent } from '@/entities/notification/api/notification-types'

export const subscribeToEvent = <T>(event: SocketEvent, callback: (data: T) => void) => {
  const socket = getSocket()
  socket.on(event, callback)
  return () => {
    socket.off(event, callback)
  }
}
