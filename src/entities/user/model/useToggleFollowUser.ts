'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../api/user'
import type { PublicUserProfile, UserProfileResponse } from '../api/user-types'

type ToggleFollowVariables = {
  profileId: number
  userName: string | null
  isFollowing: boolean
}

type ToggleFollowContext = {
  previousProfile: UserProfileResponse | undefined
  previousPublicProfile: PublicUserProfile | undefined
}

export const useToggleFollowUser = (currentUserName?: string | null) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<void, Error, ToggleFollowVariables, ToggleFollowContext>({
    mutationFn: async ({ profileId, isFollowing }) => {
      if (isFollowing) {
        await userApi.unfollowUser(profileId)
        return
      }

      await userApi.followUser({ selectedUserId: profileId })
    },
    onMutate: async ({ userName, isFollowing, profileId }) => {
      const profileQueryKey = ['public-user-profile', profileId] as const

      await queryClient.cancelQueries({ queryKey: profileQueryKey })

      const previousPublicProfile = queryClient.getQueryData<PublicUserProfile>(profileQueryKey)

      // Оптимистичное обновление профиля того, на кого подписываемся (followers)
      if (previousPublicProfile) {
        const prevMetadata = previousPublicProfile.userMetadata ?? {
          following: 0,
          followers: 0,
          publications: 0
        }
        const delta = isFollowing ? -1 : 1
        queryClient.setQueryData<PublicUserProfile>(profileQueryKey, {
          ...previousPublicProfile,
          isFollowing: !isFollowing,
          userMetadata: {
            ...prevMetadata,
            followers: Math.max(0, prevMetadata.followers + delta)
          }
        })
      }

      // Оптимистичное обновление своего профиля (followingCount)
      let previousMyProfile: UserProfileResponse | undefined
      if (currentUserName) {
        const myProfileKey = ['user-profile', currentUserName] as const
        await queryClient.cancelQueries({ queryKey: myProfileKey })
        previousMyProfile = queryClient.getQueryData<UserProfileResponse>(myProfileKey)

        if (previousMyProfile) {
          const followingDelta = isFollowing ? -1 : 1
          queryClient.setQueryData<UserProfileResponse>(myProfileKey, {
            ...previousMyProfile,
            followingCount: Math.max(0, previousMyProfile.followingCount + followingDelta)
          })
        }
      }

      if (!userName) {
        return { previousProfile: undefined, previousPublicProfile }
      }

      const userProfileKey = ['user-profile', userName] as const
      await queryClient.cancelQueries({ queryKey: userProfileKey })
      const previousProfile = queryClient.getQueryData<UserProfileResponse>(userProfileKey)

      if (previousProfile) {
        queryClient.setQueryData<UserProfileResponse>(userProfileKey, {
          ...previousProfile,
          isFollowing: !isFollowing,
          followersCount: Math.max(0, previousProfile.followersCount + (isFollowing ? -1 : 1))
        })
      }

      return { previousProfile, previousPublicProfile }
    },
    onSuccess: async (_data, variables) => {
      // Принудительный refetch сразу после успешной мутации
      const refetchPromises: Promise<unknown>[] = []

      // Рефетчим профиль того, на кого подписались
      refetchPromises.push(
        queryClient.refetchQueries({
          queryKey: ['public-user-profile', variables.profileId],
          type: 'active'
        })
      )

      // Рефетчим свой профиль если есть userName
      if (currentUserName) {
        refetchPromises.push(
          queryClient.refetchQueries({
            queryKey: ['user-profile', currentUserName],
            type: 'active'
          })
        )
      }

      // Рефетчим профиль по userName если есть
      if (variables.userName) {
        refetchPromises.push(
          queryClient.refetchQueries({
            queryKey: ['user-profile', variables.userName],
            type: 'active'
          })
        )
      }

      await Promise.all(refetchPromises)
    },
    onError: (_error, variables, context) => {
      if (context?.previousPublicProfile) {
        queryClient.setQueryData<PublicUserProfile>(
          ['public-user-profile', variables.profileId],
          context.previousPublicProfile
        )
      }

      if (variables.userName && context?.previousProfile) {
        queryClient.setQueryData<UserProfileResponse>(['user-profile', variables.userName], context.previousProfile)
      }
    },
    onSettled: async (_data, _error, variables) => {
      // Инвалидация затронутых запросов с принудительным refetch:
      // 1. Профиль того, на кого подписались/отписались
      // 2. Посты того пользователя
      // 3. Свой собственный профиль (для обновления счётчика following)
      const invalidations: Promise<void>[] = [
        queryClient.invalidateQueries({
          queryKey: ['public-user-profile', variables.profileId],
          refetchType: 'active' // Принудительный refetch активных запросов
        }),
        queryClient.invalidateQueries({
          queryKey: ['user-posts', variables.profileId],
          refetchType: 'active'
        })
      ]

      // Инвалидируем профиль того, на кого подписались (если есть userName)
      if (variables.userName) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: ['user-profile', variables.userName],
            refetchType: 'active'
          })
        )
      }

      // ВАЖНО: инвалидируем свой собственный профиль для обновления счётчика following
      if (currentUserName) {
        invalidations.push(
          queryClient.invalidateQueries({
            queryKey: ['user-profile', currentUserName],
            refetchType: 'active'
          })
        )
      }

      await Promise.all(invalidations)
    }
  })

  return {
    toggleFollow: mutation.mutate,
    toggleFollowAsync: mutation.mutateAsync,
    isPending: mutation.isPending
  }
}
