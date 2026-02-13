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

export const useToggleFollowUser = () => {
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
      // Инвалидация только затронутых запросов — профиль просматриваемого юзера и его посты.
      // Избегаем широкой инвалидации, чтобы не перезаписывать оптимистичное обновление.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['public-user-profile', variables.profileId]
        }),
        queryClient.invalidateQueries({
          queryKey: ['user-posts', variables.profileId]
        }),
        variables.userName
          ? queryClient.invalidateQueries({
              queryKey: ['user-profile', variables.userName]
            })
          : Promise.resolve()
      ])
    }
  })

  return {
    toggleFollow: mutation.mutate,
    toggleFollowAsync: mutation.mutateAsync,
    isPending: mutation.isPending
  }
}
