// хук для написания комментария к публикации
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { CommentSchema } from './validation'

import { postsApi } from '@/entities/posts/api' // Импортируем CreateCommentResponse
import { CreateCommentParams, CreateCommentResponse } from '../api/types'
import { commentKeys } from './queryKeys'

export const useCreateComment = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateCommentResponse, Error, CreateCommentParams>({
    // Меняем Comment на CreateCommentResponse
    mutationFn: async (params: CreateCommentParams) => {
      // ✅ валидируем только content
      CommentSchema.parse({ content: params.content })
      const response = await postsApi.createComment(params) // response это axios response
      return response.data // Возвращаем response.data
    },
    onSuccess: (data, variables) => {
      // data теперь это CreateCommentResponse (ваш комментарий с сервера)
      queryClient.invalidateQueries({
        queryKey: commentKeys.comments(variables.postId)
      })
      // data можно использовать в форме!
    },
    onError: (error) => {
      console.error('Failed to create comment:', error)
    }
  })
}
