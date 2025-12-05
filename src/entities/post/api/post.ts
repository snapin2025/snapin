import { api } from '@/shared/api'
import { Post } from './types'

/**
 * API для работы с постами
 * Используется в Server Components и Client Components через React Query
 */
export const postApi = {
  /**
   * Получить пост по ID
   * @param postId - ID поста
   * @returns Данные поста
   */
  getPost: async (postId: number): Promise<Post> => {
    const { data } = await api.get<Post>(`/posts/id/${postId}`)
    return data
  }
}
