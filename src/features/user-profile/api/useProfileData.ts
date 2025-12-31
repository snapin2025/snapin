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
  profileOwner: profileOwner
  displayName: string
  avatarUrl: string | undefined
  bio: string | undefined

  // Общее состояние
  isLoading: boolean
}


export const useProfileData = ({ userId, pageSize = 8 }: UseProfileDataParams): UseProfileDataReturn => {
  const { user, isLoading: isAuthLoading } = useAuth()

  const isMyProfile = useMemo(() => user?.userId === userId, [user?.userId, userId])

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

  // Загружаем данные профиля по userId
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile(userId)

  // Вычисляем производные значения
  const profileOwner: profileOwner = useMemo(() => (isMyProfile ? 'myProfile' : 'guestProfile'), [isMyProfile])

  const displayName = useMemo(
    () => profileData?.userName || user?.userName || 'User',
    [profileData?.userName, user?.userName]
  )

  const avatarUrl = useMemo(() => profileData?.avatars?.[0]?.url, [profileData?.avatars])

  const bio = useMemo(() => profileData?.aboutMe, [profileData?.aboutMe])

  // Упрощенная логика определения состояния загрузки
  const isLoading = useMemo(() => {
    // Загружается авторизация
    if (isAuthLoading) return true

    // Для своего профиля: загружается профиль и еще нет данных
    if (isMyProfile) {
      return isProfileLoading && !profileData
    }

    // Для чужого профиля:
    // - Загружаются посты и еще нет данных
    // - ИЛИ загружается профиль и еще нет данных профиля
    if (isPostsLoading && !postsData) return true
    if (isProfileLoading && !profileData) return true

    return false
  }, [isAuthLoading, isMyProfile, isProfileLoading, profileData, isPostsLoading, postsData])

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
    displayName,
    avatarUrl,
    bio,
    isLoading
  }
}
