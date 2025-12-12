'use client'

import { useMemo } from 'react' // Используем только для allPosts (дорогая операция flatMap)
import { useParams } from 'next/navigation'
import { ProfileSkeleton } from '@/shared/ui'
import { useAuth } from '@/shared/lib'
import { UserProfile } from '@/pages/profile/ui/userProfile'
import type { profileOwner } from '@/pages/profile/ui/userProfile/ButtonContainer'
import { useUserProfile, useUserPosts } from '@/pages/profile/api'
import { PostsCacheProvider } from '@/widgets/homePostsList/ui/PostsCacheProvider'

export function ProfilePage() {
  const params = useParams<{ id?: string }>()
  const userId = Number(params?.id)

  const { user, isLoading: isAuthLoading } = useAuth()

  // Определяем, это свой профиль или чужой
  const isMyProfile = user?.userId === userId

  // Загружаем посты сразу (независимо от профиля)
  const {
    data: postsData,
    isLoading: isPostsLoading,
    isFetching: isPostsFetching,
    isFetchingNextPage: isFetchingNextPage,
    isError: isPostsError,
    error: postsError,
    refetch: refetchPosts,
    fetchNextPage,
    hasNextPage
  } = useUserPosts({ userId, pageSize: 8 })

  // Получаем userName: если свой профиль - используем user.userName,
  // иначе берем из первого поста (может быть undefined пока посты не загрузились)
  const userNameFromPosts = postsData?.pages[0]?.items[0]?.userName
  const userName = isMyProfile ? user?.userName : userNameFromPosts

  // Загружаем профиль параллельно с постами
  // Для своего профиля - сразу, для чужого - как только появится userName из постов
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile(userName)

  // Объединяем все страницы постов в один массив для кэширования
  // Мемоизируем, чтобы избежать пересчета при каждом рендере
  // Это нужно для предзаполнения кэша React Query, чтобы при открытии поста
  // данные уже были в кэше и не требовался дополнительный запрос
  const allPosts = useMemo(() => postsData?.pages.flatMap((page) => page.items) ?? [], [postsData?.pages])

  // Простые вычисления - React 19 оптимизирует их автоматически
  // Оставляем только мемоизацию для дорогих операций (allPosts) и объектов (stats)
  const owner: profileOwner = isMyProfile ? 'myProfile' : 'guestProfile'
  const avatarUrl = profileData?.avatars?.[0]?.url
  const bio = profileData?.aboutMe
  const displayName = profileData?.userName || userNameFromPosts || user?.userName || 'User'

  if (!userId || Number.isNaN(userId)) {
    return <div>Профиль не найден</div>
  }

  // Показываем скелетон только если еще загружается авторизация или
  // если это свой профиль и профиль еще загружается (для своего профиля userName известен сразу)
  // Для чужого профиля не блокируем рендер - показываем страницу даже если профиль еще загружается
  const shouldShowSkeleton = isAuthLoading || (isMyProfile && isProfileLoading)

  if (shouldShowSkeleton) {
    return <ProfileSkeleton />
  }

  return (
    <PostsCacheProvider posts={allPosts}>
      <UserProfile
        profileOwner={owner}
        displayName={displayName}
        avatarUrl={avatarUrl}
        bio={bio}
        profileData={profileData}
        postsData={postsData}
        isPostsLoading={isPostsLoading}
        isPostsFetching={isPostsFetching}
        isFetchingNextPage={isFetchingNextPage}
        isPostsError={isPostsError}
        postsError={postsError}
        refetchPosts={refetchPosts}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </PostsCacheProvider>
  )
}
