import { GetCommentsParams } from '../api/types'
import { useQuery } from '@tanstack/react-query'
import { commentKeys } from './queryKeys'
import { postsApi } from '../api'

export const useComments = (params: GetCommentsParams) => {
  const { postId, pageSize = 6 } = params

  return useQuery({
    queryKey: commentKeys.commentsList(postId, pageSize),
    queryFn: () => postsApi.getComments({ postId, pageSize }),
    enabled: !!postId && postId > 0,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000
  })
}
