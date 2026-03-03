// типы  то что приходит

// ✅ Только то, что в теле запроса
export type LikeStatus = 'LIKE' | 'NONE'

// ✅ Тип ответа от сервера на запрос лайка
export type LikeResponse = {
  isLiked: boolean
  likesCount: number
}
