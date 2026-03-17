export const commentKeys = {
  post: (postId: number) => ['posts', postId] as const,

  // все комментарии поста (для invalidate)
  comments: (postId: number) => ['posts', postId, 'comments'] as const,

  // конкретная страница комментариев
  commentsList: (postId: number, pageSize: number) => ['posts', postId, 'comments', pageSize] as const,

  // все ответы на комментарий (для invalidate)
  answers: (postId: number, commentId: number) => ['posts', postId, 'comments', commentId, 'answers'] as const,

  // конкретная страница ответов
  answersList: (postId: number, commentId: number, pageSize: number) =>
    ['posts', postId, 'comments', commentId, 'answers', pageSize] as const
}
