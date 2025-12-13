'use client'

import { useParams } from 'next/navigation'
import { ProfileSkeleton } from '@/shared/ui'
import { useAuth } from '@/shared/lib'
import { UserProfile } from '@/pages/profile/ui/userProfile'
import type { profileOwner } from '@/pages/profile/ui/userProfile/ButtonContainer'
import { useUserProfile, useUserPosts } from '@/pages/profile/api'

export function ProfilePage() {
  const params = useParams<{ id?: string }>()
  const userId = Number(params?.id)

  const { user, isLoading: isAuthLoading } = useAuth()

  const isMyProfile = user?.userId === userId

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

  const { data: profileData, isLoading: isProfileLoading } = useUserProfile(userName)

  const owner: profileOwner = isMyProfile ? 'myProfile' : 'guestProfile'
  const avatarUrl = profileData?.avatars?.[0]?.url
  const bio = profileData?.aboutMe
  const displayName = profileData?.userName || userNameFromPosts || user?.userName || 'User'

  if (!userId || Number.isNaN(userId)) {
    return <div>Профиль не найден</div>
  }

  const shouldShowSkeleton = isAuthLoading || (isMyProfile && isProfileLoading)

  if (shouldShowSkeleton) {
    return <ProfileSkeleton />
  }

  return (
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
  )
}
