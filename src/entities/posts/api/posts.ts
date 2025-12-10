// запрос
// entities/post/api/posts.ts
import { EditPost } from './posts-types'
import { api } from '@/shared/api'
import { Post } from '@/entities/posts/types'

export const postsApi = {
  deletePost: async (id: string): Promise<void> => {
    await api.delete<void>(`/api/v1/posts/${id}`)
  },
  getPost: async (postId: number): Promise<Post> => {
    const { data } = await api.get<Post>(`/posts/id/${postId}`)
    return data
  },
  editPost: async ({ postId, description }: EditPost) => {
    await api.put<void>(`/api/v1/posts/${postId}`, {
      description
    })
  }
}
