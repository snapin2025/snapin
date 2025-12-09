import { useMutation } from '@tanstack/react-query'
import { userApi } from '@/entities/user'
import { AxiosError } from 'axios'
import { PostImagesPayload, PostImagesResponse } from '@/entities/user/api/user-types'

export const useCreatePostImage = () => {
  return useMutation<PostImagesResponse, AxiosError, PostImagesPayload>({
    mutationFn: (payload) => userApi.createPostImage(payload)
  })
}
