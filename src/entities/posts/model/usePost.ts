import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { postsApi } from '@/entities/posts/api'
import type { Post } from '@/entities/posts/api/types'

/**
 * React Query хук для получения поста
 * Используется в Client Components
 */
export const usePost = (
  postId: number,
  options?: Omit<UseQueryOptions<Post>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getPost(postId),
    retryDelay: 1000, // Задержка 1 секунда перед повтором
    ...options
  })
}
