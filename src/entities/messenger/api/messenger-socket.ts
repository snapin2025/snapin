import { getSocket } from '@/shared/socket/getSocket'
import { WS_EVENT } from '../model/constants'
import type { MessageSendRequest, MessageUpdateRequest, DialogMessage } from './messenger-types'

export const emitSendMessage = (payload: MessageSendRequest): boolean => {
  const socket = getSocket()
  if (!socket) return false
  socket.emit(WS_EVENT.RECEIVE_MESSAGE, payload)
  return true
}

export const emitUpdateMessage = (payload: MessageUpdateRequest): boolean => {
  const socket = getSocket()
  if (!socket) return false
  socket.emit(WS_EVENT.UPDATE_MESSAGE, payload)
  return true
}

export type MessageSendAckPayload = {
  message: DialogMessage
  receiverId: number
}

export const subscribeToMessageSendWithAck = (
  handler: (data: DialogMessage, ack: (payload: MessageSendAckPayload) => void) => void
): (() => void) => {
  const socket = getSocket()
  if (!socket) return () => {}

  const callback = (data: DialogMessage, ack?: (payload: MessageSendAckPayload) => void) => {
    handler(data, ack ?? (() => {}))
  }

  socket.on(WS_EVENT.MESSAGE_SEND, callback)

  return () => {
    socket.off(WS_EVENT.MESSAGE_SEND, callback)
  }
}
