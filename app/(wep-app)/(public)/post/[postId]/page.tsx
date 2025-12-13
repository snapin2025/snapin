import { Metadata } from 'next'
import { PostModal } from '@/features/posts'

export const metadata: Metadata = { title: 'Post' }

/**
 * Обычная страница поста для прямого доступа (F5, прямая ссылка, share)
 *
 * Когда пользователь открывает /post/[postId] напрямую (не через клик),
 * используется этот роут вместо intercepting route.
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

  // Используем тот же компонент модального окна
  // но в контексте обычной страницы
  return <PostModal postId={postIdNumber} />
}

export default PostPage
