import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { postsApi } from '@/entities/posts/api/posts'
import type { Post, ResponsesPosts } from '@/entities/posts/api/types'
import { useAuth } from '@/shared/lib'

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation<void, AxiosError, number>({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: async (_, postId) => {
      // Получаем пост из кэша, чтобы узнать ownerId владельца поста
      const post = queryClient.getQueryData<Post>(['post', postId])
      const ownerId = post?.ownerId || user?.userId

      // Удаляем пост из кэша infinite query перед инвалидацией
      // Это предотвращает запросы по несуществующему ID поста
      if (ownerId) {
        // Находим все infinite queries для этого пользователя
        const queryCache = queryClient.getQueryCache()
        const queries = queryCache.findAll({ queryKey: ['user-posts', ownerId] })

        // Обновляем каждую infinite query, удаляя удаленный пост из всех страниц
        queries.forEach((query) => {
          const data = query.state.data as InfiniteData<ResponsesPosts> | undefined
          if (data) {
            const updatedPages = data.pages
              .map((page) => ({
                ...page,
                items: page.items.filter((item) => item.id !== postId)
              }))
              .filter((page) => page.items.length > 0) // Удаляем пустые страницы

            queryClient.setQueryData<InfiniteData<ResponsesPosts>>(query.queryKey, {
              ...data,
              pages: updatedPages,
              pageParams: data.pageParams
            })
          }
        })
      }

      // Удаляем конкретный пост из кэша
      queryClient.removeQueries({ queryKey: ['post', postId] })

      // Инвалидируем все запросы постов владельца для обновления данных с сервера
      // Используем префиксный поиск: ['user-posts', ownerId] инвалидирует
      // все запросы ['user-posts', ownerId, pageSize] независимо от pageSize
      if (ownerId) {
        await queryClient.invalidateQueries({
          queryKey: ['user-posts', ownerId],
          refetchType: 'active' // Принудительно обновляем активные запросы
        })
      }
    }
  })
}
