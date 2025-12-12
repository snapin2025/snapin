import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { postsApi } from '@/entities/posts/api/posts'

export const useDeletePost = () =>
  useMutation<void, AxiosError, number>({
    mutationFn: (id: number) => postsApi.deletePost(id)
  })
