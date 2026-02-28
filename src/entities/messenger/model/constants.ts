export const WS_EVENT = {
  RECEIVE_MESSAGE: 'receive-message',
  UPDATE_MESSAGE: 'update-message',
  MESSAGE_DELETED: 'message-deleted',
  MESSAGE_SEND: 'message-send',
  ERROR: 'error',
  NOTIFICATIONS: 'notifications'
} as const

export type WsEvent = (typeof WS_EVENT)[keyof typeof WS_EVENT]
