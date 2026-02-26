// Статусы сообщений
export type MessageStatus = 'SENT' | 'RECEIVED' | 'READ'

// Тип сообщения
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE'

// WebSocket: запрос на отправку сообщения (RECEIVE_MESSAGE emit)
export type MessageSendRequest = {
  message: string
  receiverId: number
}

// WebSocket: запрос на обновление сообщения (UPDATE_MESSAGE emit)
export type MessageUpdateRequest = {
  id: number
  message: string
}

// WebSocket: ответ при ошибке (ERROR event)
export type MessengerError = {
  message: string
  error: string
}

// Сообщение внутри диалога (строго по Swagger)
export type DialogMessage = {
  id: number
  ownerId: number
  receiverId: number
  messageText: string
  createdAt: string
  updatedAt: string
  messageType: MessageType
  status: MessageStatus
}

// Ответ API списка сообщений диалога
export type DialogMessagesResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: DialogMessage[]
}

export type Avatar = {
  url: string
  width: number
  height: number
  fileSize: number
  createdAt: string // ISO string
}
export type Dialog = {
  id: number
  ownerId: number
  receiverId: number
  messageText: string
  createdAt: string
  updatedAt: string
  messageType: MessageType
  status: MessageStatus
  userName: string
  avatars: Avatar[]
  notReadCount: number
}
export type DialogsResponse = {
  pageSize: number
  totalCount: number
  notReadCount: number
  items: Dialog[]
}
