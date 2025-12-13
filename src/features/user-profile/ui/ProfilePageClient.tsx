'use client'

import { ProfileSkeleton } from '@/shared/ui'
import { UserProfile } from './UserProfile'
import { useProfileData } from '../api'

type ProfilePageClientProps = {
  userId: number
}

/**
 * Клиентский компонент страницы профиля.
 * Использует хук useProfileData для получения всех данных и состояний.
 * Обрабатывает начальное состояние загрузки.
 */
export const ProfilePageClient = ({ userId }: ProfilePageClientProps) => {
  const { isLoading, profileData, postsData } = useProfileData({ userId })

  // Показываем скелетон только при начальной загрузке (когда нет данных)
  if (isLoading && !profileData && !postsData) {
    return <ProfileSkeleton />
  }

  // UserProfile использует тот же хук, React Query кэширует запросы
  return <UserProfile userId={userId} />
}
