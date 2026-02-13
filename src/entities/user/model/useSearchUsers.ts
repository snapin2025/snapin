'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { userApi } from '../api/user'

const DEFAULT_PAGE_SIZE = 12

type UseSearchUsersParams = {
  search: string
  pageSize?: number
}

export const useSearchUsers = ({ search, pageSize = DEFAULT_PAGE_SIZE }: UseSearchUsersParams) => {
  const normalizedSearch = search.trim()

  return useInfiniteQuery({
    queryKey: ['search-users', normalizedSearch, pageSize],
    initialPageParam: 0,
    enabled: normalizedSearch.length > 0,
    queryFn: ({ pageParam }: { pageParam: number }) =>
      userApi.searchUsers({
        search: normalizedSearch,
        pageSize,
        cursor: pageParam
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.nextCursor || lastPage.nextCursor <= 0) {
        return undefined
      }

      return lastPage.nextCursor
    },
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false
  })
}
