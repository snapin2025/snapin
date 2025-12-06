// запрос
// entities/post/api/posts.ts
import { EditPost } from './posts-types'
import { api } from '@/shared/api'

export const postsApi = {
  editPost: async ({ postId, description }: EditPost) => {
    await api.put<void>(`/api/v1/posts/${postId}`, {
      description
    })
  }
}
