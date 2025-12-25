import { HydrationBoundary } from '@tanstack/react-query'
import { PostModal } from '@/features/posts'
import { prefetchPostWithComments } from '@/features/posts/view-post/api/prefetch-posts'

/**
 * Intercepting Route для модального окна поста
 *
 * Этот файл перехватывает навигацию на /post/[postId] и показывает модальное окно
 * вместо полной перезагрузки страницы.
 *
 * Синтаксис (.) означает перехват на том же уровне роутинга.
 *
 * Как это работает:
 * 1. Пользователь кликает на пост → навигация на /post/123
 * 2. Next.js перехватывает навигацию через (.)[postId]
 * 3. Рендерится модальное окно, URL обновляется на /post/123
 * 4. При закрытии модального окна (router.back()) возвращаемся на предыдущую страницу
 * 5. При прямом переходе на /post/123 (F5, прямая ссылка) используется обычный [postId]/page.tsx
 *
 * Реализован SSR с HydrationBoundary для предзагрузки данных на сервере.
 * Скелетон показывается автоматически через loading.tsx во время await prefetchPostWithComments()
 */
type Props = {
  params: Promise<{ postId: string }>
}

export default async function PostModalPage({ params }: Props) {
  const { postId } = await params
  const postIdNumber = parseInt(postId, 10)

  if (isNaN(postIdNumber) || postIdNumber <= 0) {
    return null
  }

  // Предзагружаем данные поста и комментариев в одном QueryClient
  // loading.tsx автоматически показывается во время выполнения этого await
  const dehydratedState = await prefetchPostWithComments(postIdNumber)

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostModal postId={postIdNumber} />
    </HydrationBoundary>
  )
}
