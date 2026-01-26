export type Notification = {
  id: number
  clientId: string
  message: string
  isRead: boolean
  notifyAt: string
}

export type NotificationResponse = Notification[]
