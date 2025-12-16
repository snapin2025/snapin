import { Suspense } from 'react'
import { HydrationBoundary } from '@tanstack/react-query'
import { PostModal } from '../PostModal'
import { prefetchPostWithComments } from '../api/prefetch-posts'
import { PostModalSkeleton } from '@/shared/ui'

type PostModalWithPrefetchProps = {
  postId: number
}

/**
 * Server Component для предзагрузки данных поста
 * Показывает скелетон во время предзагрузки через Suspense
 */
async function PostModalContent({ postId }: PostModalWithPrefetchProps) {
  // Предзагружаем данные поста и комментариев в одном QueryClient
  const dehydratedState = await prefetchPostWithComments(postId)

  return (
    <HydrationBoundary state={dehydratedState}>
      <PostModal postId={postId} />
    </HydrationBoundary>
  )
}

/**
 * Обертка с Suspense для показа скелетона во время предзагрузки
 */
export function PostModalWithPrefetch({ postId }: PostModalWithPrefetchProps) {
  return (
    <Suspense fallback={<PostModalSkeleton />}>
      <PostModalContent postId={postId} />
    </Suspense>
  )
}
