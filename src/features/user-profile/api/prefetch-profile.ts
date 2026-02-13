import { dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/app/providers/query-provider/get-query-client'
import { postsApi } from '@/entities/posts/api'

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

    // Не префетчим public-user-profile на сервере:
    // isFollowing зависит от авторизации конкретного пользователя.
    // На сервере часто нет client accessToken, что приводит к stale isFollowing=false
    // в HydrationBoundary. Этот запрос выполняется на клиенте с актуальной auth-сессией.
  } catch (e) {
    console.error('Prefetch profile error', e)
  }

  return dehydrate(queryClient)
}
