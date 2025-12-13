'use client'

import { useMemo } from 'react'
import { useAuth } from '@/shared/lib'
import { useUserProfile } from '@/entities/user'
import { useUserPosts } from '@/entities/posts/model'
import type { profileOwner } from '../ui/ProfileActions'

type UseProfileDataParams = {
  userId: number
  pageSize?: number
}

type UseProfileDataReturn = {
  // Данные
  profileData: ReturnType<typeof useUserProfile>['data']
  postsData: ReturnType<typeof useUserPosts>['data']

  // Состояния загрузки
  isProfileLoading: boolean
  isPostsLoading: boolean
  isPostsFetching: boolean
  isFetchingNextPage: boolean

  // Ошибки
  isPostsError: boolean
  postsError: Error | null

  // Действия
  refetchPosts: (() => void) | undefined
  fetchNextPage: (() => void) | undefined
  hasNextPage: boolean

  // Вычисленные значения
  profileOwner: profileOwner
  displayName: string
  avatarUrl: string | undefined
  bio: string | undefined
  isMyProfile: boolean

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

  const isMyProfile = useMemo(() => user?.userId === userId, [user?.userId, userId])

  // Загружаем посты пользователя
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
  } = useUserPosts({ userId, pageSize })

  // Получаем userName: если свой профиль - используем user.userName,
  // иначе берем из первого поста (может быть undefined пока посты не загрузились)
  const userNameFromPosts = useMemo(() => postsData?.pages[0]?.items[0]?.userName, [postsData?.pages])

  const userName = useMemo(
    () => (isMyProfile ? user?.userName : userNameFromPosts) ?? null,
    [isMyProfile, user?.userName, userNameFromPosts]
  )

  // Загружаем данные профиля
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile(userName)

  // Вычисляем производные значения
  const profileOwner: profileOwner = useMemo(() => (isMyProfile ? 'myProfile' : 'guestProfile'), [isMyProfile])

  const displayName = useMemo(
    () => profileData?.userName || userNameFromPosts || user?.userName || 'User',
    [profileData?.userName, userNameFromPosts, user?.userName]
  )

  const avatarUrl = useMemo(() => profileData?.avatars?.[0]?.url, [profileData?.avatars])

  const bio = useMemo(() => profileData?.aboutMe, [profileData?.aboutMe])

  // Общее состояние загрузки
  const isLoading = useMemo(
    () => isAuthLoading || (isMyProfile && isProfileLoading),
    [isAuthLoading, isMyProfile, isProfileLoading]
  )

  return {
    profileData,
    postsData,
    isProfileLoading,
    isPostsLoading,
    isPostsFetching,
    isFetchingNextPage,
    isPostsError,
    postsError,
    refetchPosts,
    fetchNextPage,
    hasNextPage,
    profileOwner,
    displayName,
    avatarUrl,
    bio,
    isMyProfile,
    isLoading
  }
}
