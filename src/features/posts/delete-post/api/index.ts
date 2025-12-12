import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { postsApi } from '@/entities/posts/api/posts'

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError, string>({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onSuccess: (_, postId) => {
      // Инвалидируем кэш конкретного поста
      queryClient.invalidateQueries({ queryKey: ['post', Number(postId)] })
      // Инвалидируем все списки постов (включая user-posts для профиля)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['user-posts'] })
    }
  })
}
