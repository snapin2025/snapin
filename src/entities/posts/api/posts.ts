import { api } from '@/shared/api'

export const postsApi = {
  deletePost: async (id: string): Promise<void> => {
    await api.delete<void>(`/api/v1/posts/${id}`)
  }
}
