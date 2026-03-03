// типы для Написать комментарий к публикации

// Типы для создания комментария
export type CreateCommentParams = {
  postId: number
  content: string
}

// Типы ответа от сервера
export type CommentAuthor = {
  id: number
  username: string
  avatars: Array<{ url?: string }> // или массив объектов с аватарками
}

export type CreateCommentResponse = {
  id: number
  postId: number
  from: CommentAuthor
  content: string
  createdAt: string
  answerCount: number
  likeCount: number
  isLiked: boolean
}

// Для списка комментариев (если нужно)
export type Comment = CreateCommentResponse
