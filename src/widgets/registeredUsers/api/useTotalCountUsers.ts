import { useQuery } from '@tanstack/react-query'

import { userApi } from '@/entities/user'

export const useTotalCountUsers = () => {
  return useQuery({
    queryKey: ['totalCountUsers'],
    queryFn: userApi.totalCountUsers,
    retry: false,
    refetchOnWindowFocus: false
  })
}

