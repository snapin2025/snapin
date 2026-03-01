// хук для написания комментария к публикации
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createComment } from '../api/createComment'
import { CommentSchema } from './validation'
import type { CreateCommentParams, CreateCommentResponse } from './types' // Импортируем CreateCommentResponse

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateCommentResponse, Error, CreateCommentParams>({
    // Меняем Comment на CreateCommentResponse
    mutationFn: async (params: CreateCommentParams) => {
      // ✅ валидируем только content
      CommentSchema.parse({ content: params.content })
      const response = await createComment(params) // response это axios response
      return response.data // Возвращаем response.data
    },
    onSuccess: (data, variables) => {
      // data теперь это CreateCommentResponse (ваш комментарий с сервера)
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId]
      })
      // data можно использовать в форме!
    },
    onError: (error) => {
      console.error('Failed to create comment:', error)
    }
  })
}
