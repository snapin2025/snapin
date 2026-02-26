import { api } from '@/shared/api'
import { Dialog, DialogMessage } from '@/entities/messenger/api/messenger-types'

export type GetMessagesParams = {
  cursor?: number
  pageSize?: number
  searchName?: string
}

export type GetDialogMessagesParams = {
  dialoguePartnerId: number
  cursor?: number
  pageSize?: number
  searchName?: string
}

export type UpdateMessageStatusParams = {
  ids: number[]
}

export const messengerApi = {
  // 1️⃣ Получить список последних диалогов
  getDialogs: async (
    params: GetMessagesParams = {}
  ): Promise<{
    pageSize: number
    totalCount: number
    notReadCount: number
    items: Dialog[]
  }> => {
    const { cursor, pageSize = 12, searchName } = params
    const { data } = await api.get('/messenger', {
      params: { cursor, pageSize, searchName }
    })
    return data
  },

  // 2️⃣ Получить сообщения по конкретному пользователю (диалогу)
  getMessages: async (
    params: GetDialogMessagesParams
  ): Promise<{
    pageSize: number
    totalCount: number
    notReadCount: number
    items: DialogMessage[]
  }> => {
    const { dialoguePartnerId, cursor, pageSize = 12, searchName } = params
    const { data } = await api.get(`/messenger/${dialoguePartnerId}`, {
      params: { cursor, pageSize, searchName }
    })
    return data
  },

  // 3️⃣ Обновить статус сообщений (например, READ)
  updateStatus: async (params: UpdateMessageStatusParams): Promise<void> => {
    await api.put('/messenger', { ids: params.ids })
  },

  // 4️⃣ Удалить сообщение по ID
  deleteMessage: async (id: number): Promise<void> => {
    await api.delete(`/messenger/${id}`)
  }
}
