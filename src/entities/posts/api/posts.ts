// запрос
// entities/post/api/posts.ts

import { api } from '@/shared/api'
import { CommentsResponse, EditPost, GetCommentsParams, Post, ResponsesPosts } from '@/entities/posts/api/types'

export const postsApi = {
  deletePost: async (id: string): Promise<void> => {
    await api.delete<void>(`/posts/${id}`)
  },
  editPost: async ({ postId, description }: EditPost) => {
    await api.put<void>(`/posts/${postId}`, {
      description
    })
  },
  getPost: async (postId: number): Promise<Post> => {
    const { data } = await api.get<Post>(`/posts/id/${postId}`)
    return data
  },
  getComments: async (params: GetCommentsParams): Promise<CommentsResponse> => {
    const { postId, pageSize, pageNumber, sortBy, sortDirection } = params
    const { data } = await api.get<CommentsResponse>(`/posts/${postId}/comments`, {
      params: {
        pageSize: pageSize ?? 6,
        sortDirection: sortDirection ?? 'desc',
        pageNumber: pageNumber ?? 1, //то значение, которое возвращается из getNextPageParam
        sortBy: sortBy ?? ''
      }
    })
    return data
  },

  getUserPosts: async (userId: number): Promise<ResponsesPosts> => {
    const { data } = await api.get<ResponsesPosts>(`/posts/user/${userId}`)

    return data
  }
}
