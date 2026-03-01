'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../api/user'
import type { PublicUserProfile, UserProfileResponse } from '../api/user-types'

type ToggleFollowVariables = {
  profileId: number
  userName: string | null
  isFollowing: boolean
}

export const useToggleFollowUser = (currentUserName?: string | null) => {
  const queryClient = useQueryClient()

  const getAffectedKeys = (variables: ToggleFollowVariables): Array<readonly unknown[]> => {
    const keys: Array<readonly unknown[]> = [
      ['public-user-profile', variables.profileId],
      ['user-posts', variables.profileId]
    ]

    if (variables.userName) {
      keys.push(['user-profile', variables.userName])
    }

    if (currentUserName) {
      keys.push(['user-profile', currentUserName])
    }

    return keys
  }

  const mutation = useMutation<void, Error, ToggleFollowVariables>({
    mutationFn: async ({ profileId, isFollowing }) => {
      if (isFollowing) {
        await userApi.unfollowUser(profileId)
        return
      }
      await userApi.followUser({ selectedUserId: profileId })
    },
    onMutate: async (variables) => {
      const delta = variables.isFollowing ? -1 : 1
      const clamp = (value: number) => Math.max(0, value)

      queryClient.setQueryData<PublicUserProfile | undefined>(['public-user-profile', variables.profileId], (old) => {
        if (!old) {
          return old
        }

        return {
          ...old,
          isFollowing: !variables.isFollowing,
          userMetadata: {
            ...old.userMetadata,
            followers: clamp((old.userMetadata?.followers ?? 0) + delta)
          }
        }
      })

      if (variables.userName) {
        queryClient.setQueryData<UserProfileResponse | undefined>(['user-profile', variables.userName], (old) => {
          if (!old) {
            return old
          }

          return {
            ...old,
            isFollowing: !variables.isFollowing,
            followersCount: clamp((old.followersCount ?? 0) + delta)
          }
        })
      }

      if (currentUserName) {
        queryClient.setQueryData<UserProfileResponse | undefined>(['user-profile', currentUserName], (old) => {
          if (!old) {
            return old
          }

          return {
            ...old,
            followingCount: clamp((old.followingCount ?? 0) + delta)
          }
        })
      }
    },
    onError: async (_error, variables) => {
      if (!variables) {
        return
      }

      await Promise.all(
        getAffectedKeys(variables).map((queryKey) =>
          queryClient.invalidateQueries({
            queryKey,
            refetchType: 'all'
          })
        )
      )
    },
    onSettled: async (_data, _error, variables) => {
      if (!variables) {
        return
      }

      await Promise.all(
        getAffectedKeys(variables).map((queryKey) =>
          queryClient.invalidateQueries({
            queryKey,
            refetchType: 'all'
          })
        )
      )
    }
  })

  return {
    toggleFollow: mutation.mutate,
    toggleFollowAsync: mutation.mutateAsync,
    isPending: mutation.isPending
  }
}
