import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { postsApi } from '@/entities/posts/api/posts'

export const useDeletePost = () =>
  useMutation<void, AxiosError, string>({
    mutationFn: (id: string) => postsApi.deletePost(id)
  })
