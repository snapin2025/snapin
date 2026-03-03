'use client'

import { useQuery } from '@tanstack/react-query'
import { postsApi } from '../api/posts'

type UseFeedPostsParams = {
  pageNumber?: number
  pageSize?: number
  endCursorPostId?: number
  enabled?: boolean
}

export const useFeedPosts = ({
  pageNumber,
  pageSize = 12,
  endCursorPostId = 0,
  enabled = true
}: UseFeedPostsParams = {}) => {
  return useQuery({
    queryKey: ['feed', pageNumber ?? null, pageSize, endCursorPostId],
    queryFn: () => postsApi.getFeedPosts({ pageNumber, pageSize, endCursorPostId }),
    enabled,
    staleTime: 0,
    gcTime: 60_000,
    retry: 1,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  })
}
