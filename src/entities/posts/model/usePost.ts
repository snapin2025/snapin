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
    enabled: !!postId && postId > 0,
    staleTime: 5 * 60 * 1000, // 5 минут - посты не меняются часто
    gcTime: 10 * 60 * 1000, // 10 минут в кэше
    retry: 1, // Одна попытка повтора при ошибке
    retryDelay: 1000 // Задержка 1 секунда перед повтором
  })
}
