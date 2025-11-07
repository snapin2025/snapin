import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/features/auth/signIn'

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    retry: false
  })
}

// export const useMeQuery = () => {
//   return useQuery({
//     queryKey: ['auth', 'me'],
//     queryFn:getMe,
//   })
// }
