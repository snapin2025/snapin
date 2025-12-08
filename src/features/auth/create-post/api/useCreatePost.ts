import { useMutation } from '@tanstack/react-query'
import { userApi } from '@/entities/user'
import { AxiosError } from 'axios'
import { CreatePostPayload, CreatePostResponse } from '@/entities/user/api/user-types'

export const useCreatePost = () => {
  return useMutation<CreatePostResponse, AxiosError, CreatePostPayload>({
    mutationFn: (payload) => userApi.createPost(payload)
  })
}
