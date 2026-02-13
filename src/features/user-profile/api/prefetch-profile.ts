import { dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/app/providers/query-provider/get-query-client'
import { postsApi } from '@/entities/posts/api'
import { userApi } from '@/entities/user/api/user'

export async function prefetchProfileWithPosts(userId: number, pageSize = 8) {
  const queryClient = getQueryClient()
  try {
    // Префетчим посты пользователя
    await queryClient.fetchInfiniteQuery({
      queryKey: ['user-posts', userId, pageSize],
      queryFn: ({ pageParam }) => {
        const cursor = pageParam === null ? undefined : pageParam
        return postsApi.getUserPosts(userId, pageSize, cursor)
      },
      initialPageParam: null,
      staleTime: 2 * 60 * 1000
    })

    // Публичный профиль — всегда свежий запрос, без учёта staleTime.
    // После Follow/Unfollow при перезагрузке данные должны быть актуальными.
    await queryClient.fetchQuery({
      queryKey: ['public-user-profile', userId],
      queryFn: () => userApi.getPublicUserProfile(userId),
      staleTime: 0
    })
  } catch (e) {
    console.error('Prefetch profile error', e)
  }

  return dehydrate(queryClient)
}
