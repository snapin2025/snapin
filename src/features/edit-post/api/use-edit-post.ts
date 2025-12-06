// хук

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postsApi } from '@/entities/posts/api'

export const useEditPost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postsApi.editPost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] })
    },
    onError: (error) => {
      console.error('Failed to edit post:', error)
    }
  })
}
