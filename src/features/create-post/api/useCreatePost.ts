import { useMutation } from '@tanstack/react-query'
import { postsApi } from '@/entities/posts/api/posts'
import { AxiosError } from 'axios'
import { CreatePostPayload, CreatePostResponse } from '@/entities/user/api/user-types'

export const useCreatePost = () => {
  return useMutation<CreatePostResponse, AxiosError, CreatePostPayload>({
    mutationFn: (payload) => postsApi.createPost(payload)
  })
}
