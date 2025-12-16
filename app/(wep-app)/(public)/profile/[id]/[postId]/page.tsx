import { Metadata } from 'next'
import { PostModalWithPrefetch } from '@/features/posts/view-post/ui/PostModalWithPrefetch'

export const metadata: Metadata = { title: 'Post' }

/**
 * Обычная страница поста для прямого доступа (F5, прямая ссылка, share)
 *
 * Когда пользователь открывает /post/[postId] напрямую (не через клик),
 * используется этот роут вместо intercepting route.
 *
 * Реализован SSR с HydrationBoundary для предзагрузки данных на сервере.
 * Скелетон показывается во время предзагрузки через Suspense.
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

  // Используем обертку с Suspense для показа скелетона во время предзагрузки
  return <PostModalWithPrefetch postId={postIdNumber} />
}

export default PostPage
