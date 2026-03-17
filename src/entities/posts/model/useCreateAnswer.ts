import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '@/entities/posts/api'
import { CommentSchema } from './validation'
import { Comment, CommentsResponse, CreateAnswerParams, CreateCommentResponse } from '../api/types'
import { commentKeys } from './queryKeys'

export const useCreateAnswer = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateCommentResponse, Error, CreateAnswerParams>({
    mutationFn: async (params: CreateAnswerParams) => {
      CommentSchema.parse({ content: params.content })

      const response = await postsApi.createAnswer(params)

      return response
    },

    onSuccess: (data, variables) => {
      // обновляем ответы
      queryClient.invalidateQueries({
        queryKey: commentKeys.answers(variables.postId, variables.commentId)
      })
      queryClient.setQueriesData({ queryKey: commentKeys.comments(variables.postId) }, (oldData: CommentsResponse) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          items: oldData.items.map((comment: Comment) =>
            comment.id === variables.commentId
              ? {
                  ...comment,
                  answerCount: (comment.answerCount || 0) + 1
                }
              : comment
          )
        }
      })
    },

    onError: (error) => {
      console.error('Failed to create answer:', error)
    }
  })
}
