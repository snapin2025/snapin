// запрос
// entities/post/api/posts.ts
import { EditPost } from './posts-types'
import { api } from '@/shared/api'
import { Post } from '@/entities/posts/types'
import {
  CreatePostPayload,
  CreatePostResponse,
  PostImagesPayload,
  PostImagesResponse
} from '@/entities/user/api/user-types'

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
  },
  createPost: async (payload: CreatePostPayload): Promise<CreatePostResponse> => {
    const { data } = await api.post<CreatePostResponse>('/posts', payload)
    return data
  },

  createPostImage: async (payload: PostImagesPayload): Promise<PostImagesResponse> => {
    const formData = new FormData()
    payload.files.forEach((file) => {
      formData.append('file', file)
    })

    const { data } = await api.post<PostImagesResponse>('/posts/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  }
}
