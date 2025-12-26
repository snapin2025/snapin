import { PostModalSkeleton } from '@/shared/ui'

/**
 * Loading UI для страниц профиля
 * 
 * Автоматически показывается Next.js во время навигации:
 * - При переходе на любую страницу внутри /profile/[id]/*
 * - Во время SSR загрузки данных на сервере
 * 
 * Этот loading.tsx будет использоваться для всех дочерних роутов,
 * если у них нет своего loading.tsx
 */
export default function ProfileLoading() {
  return <PostModalSkeleton />
}
