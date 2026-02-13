'use client'

import { useAuth } from '@/shared/lib'
import { usePublicUserProfile, useUserProfile } from '@/entities/user'
import { useUserPosts } from '@/entities/posts/model'

export type ProfileOwner = 'myProfile' | 'friendProfile' | 'guestProfile'

type UseProfileDataParams = {
  userId: number
  pageSize?: number
}

type UseProfileDataReturn = {
  // Данные
  profileData: ReturnType<typeof useUserProfile>['data']
  postsData: ReturnType<typeof useUserPosts>['data']

  // Состояния загрузки
  isPostsLoading: boolean
  isFetchingNextPage: boolean

  // Ошибки
  isPostsError: boolean
  postsError: Error | null

  // Действия
  refetchPosts: (() => void) | undefined
  fetchNextPage: (() => void) | undefined
  hasNextPage: boolean

  // Вычисленные значения (готовые к использованию в UI)
  profileOwner: ProfileOwner
  profileUserName: string | null
  isFollowing: boolean
  followingCount: number
  followersCount: number
  publicationsCount: number
  displayName: string
  avatarUrl: string | undefined
  bio: string | undefined

  // Общее состояние
  isLoading: boolean
}

/**
 * Хук для получения и обработки всех данных профиля пользователя.
 * Объединяет логику загрузки постов, профиля и вычисления производных значений.
 *
 * @param userId - ID пользователя, чей профиль нужно загрузить
 * @param pageSize - Размер страницы для постов (по умолчанию 8)
 * @returns Объект с данными профиля, состояниями загрузки и вычисленными значениями
 */
export const useProfileData = ({ userId, pageSize = 8 }: UseProfileDataParams): UseProfileDataReturn => {
  const { user, isLoading: isAuthLoading } = useAuth()

  const isMyProfile = user?.userId === userId

  // Загружаем посты пользователя
  const {
    data: postsData,
    isLoading: isPostsLoading,
    isFetchingNextPage: isFetchingNextPage,
    isError: isPostsError,
    error: postsError,
    refetch: refetchPosts,
    fetchNextPage,
    hasNextPage
  } = useUserPosts({ userId, pageSize })

  // Для своего профиля используем /users/{userName},
  // для чужого профиля — публичный профиль по userId (единый источник для follow/unfollow).
  const userName = (isMyProfile ? user?.userName : null) ?? null

  // Загружаем данные своего профиля
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile(userName)

  // Загружаем публичный профиль по userId для чужой страницы
  const { data: publicProfileData, isLoading: isPublicProfileLoading } = usePublicUserProfile(
    !isMyProfile ? userId : null
  )

  // Вычисляем производные значения из единого источника (свои данные vs публичный профиль)
  const profileOwner: ProfileOwner = isMyProfile ? 'myProfile' : user ? 'friendProfile' : 'guestProfile'
  const source = isMyProfile ? profileData : publicProfileData
  const metadata = !isMyProfile ? publicProfileData?.userMetadata : undefined

  const profileUserName = source?.userName ?? (isMyProfile ? userName : null) ?? null
  const isFollowing = !isMyProfile ? (publicProfileData?.isFollowing ?? false) : false
  const followingCount = isMyProfile ? (profileData?.followingCount ?? 0) : (metadata?.following ?? 0)
  const followersCount = isMyProfile ? (profileData?.followersCount ?? 0) : (metadata?.followers ?? 0)
  const publicationsCount = isMyProfile ? (profileData?.publicationsCount ?? 0) : (metadata?.publications ?? 0)
  const displayName =
    source?.userName ?? (isMyProfile ? user?.userName : postsData?.pages[0]?.items[0]?.userName) ?? 'User'
  const avatarUrl = source?.avatars?.[0]?.url
  const bio = source?.aboutMe

  // Определяем состояние загрузки
  const isLoading =
    isAuthLoading ||
    (isMyProfile
      ? isProfileLoading && !profileData
      : (isPostsLoading && !postsData) || (isPublicProfileLoading && !publicProfileData))

  return {
    profileData,
    postsData,
    isPostsLoading,
    isFetchingNextPage,
    isPostsError,
    postsError,
    refetchPosts,
    fetchNextPage,
    hasNextPage,
    profileOwner,
    profileUserName,
    isFollowing,
    followingCount,
    followersCount,
    publicationsCount,
    displayName,
    avatarUrl,
    bio,
    isLoading
  }
}
