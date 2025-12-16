import { Metadata } from 'next'
import { HydrationBoundary } from '@tanstack/react-query'
import { PostModal } from '@/features/posts'
import { prefetchPostWithComments } from '@/features/posts/view-post/api/prefetch-posts'

export const metadata: Metadata = { title: 'Post' }

/**
 * Обычная страница поста для прямого доступа (F5, прямая ссылка, share)
 *
 * Когда пользователь открывает /post/[postId] напрямую (не через клик),
 * используется этот роут вместо intercepting route.
 *
 * Реализован SSR с HydrationBoundary для предзагрузки данных на сервере.
 * Комментарии предзагружаются отдельно через вложенный HydrationBoundary.
 */
type Props = {
  params: Promise<{ postId: string }>
}

const PostPage = async ({ params }: Props) => {
  const { postId } = await params
  const postIdNumber = parseInt(postId, 10)

  // Валидация postId
  if (isNaN(postIdNumber) || postIdNumber <= 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Неверный ID поста</p>
      </div>
    )
  }

  // Предзагружаем данные поста и комментариев в одном QueryClient
  const dehydratedState = await prefetchPostWithComments(postIdNumber)

  // Используем тот же компонент модального окна
  // но в контексте обычной страницы с SSR hydration
  // Пост и комментарии предзагружаются вместе в одном HydrationBoundary
  return (
    <HydrationBoundary state={dehydratedState}>
      <PostModal postId={postIdNumber} />
    </HydrationBoundary>
  )
}

export default PostPage
