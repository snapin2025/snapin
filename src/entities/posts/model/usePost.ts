import { useQuery } from '@tanstack/react-query'
import { postsApi } from '@/entities/posts/api'

/**
 * React Query хук для получения поста
 * Используется в Client Components
 */
export const usePost = (postId: number) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getPost(postId),
    retryDelay: 1000 // Задержка 1 секунда перед повтором
  })
}
