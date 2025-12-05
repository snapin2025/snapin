import { PostModal } from '@/pages/post'

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
 */
type Props = {
  params: Promise<{ postId: string }>
}

export default async function PostModalPage({ params }: Props) {
  const { postId } = await params
  const postIdNumber = parseInt(postId, 10)

  if (isNaN(postIdNumber)) {
    return null
  }

  return <PostModal postId={postIdNumber} />
}
