'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userApi } from '../api/user'

type ToggleFollowVariables = {
  profileId: number
  userName: string | null
  isFollowing: boolean
}

export const useToggleFollowUser = (currentUserName?: string | null) => {
  const queryClient = useQueryClient()

  const mutation = useMutation<void, Error, ToggleFollowVariables>({
    mutationFn: async ({ profileId, isFollowing }) => {
      if (isFollowing) {
        await userApi.unfollowUser(profileId)
        return
      }
      await userApi.followUser({ selectedUserId: profileId })
    },
    onSettled: async (_data, _error, variables) => {
      if (!variables) {
        return
      }

      const keysToRefresh: Array<readonly unknown[]> = [
        ['public-user-profile', variables.profileId],
        ['public-user-profile'],
        ['user-posts', variables.profileId],
        ['user-profile']
      ]

      if (variables.userName) {
        keysToRefresh.push(['user-profile', variables.userName])
      }

      if (currentUserName) {
        keysToRefresh.push(['user-profile', currentUserName])
      }

      await Promise.all(
        keysToRefresh.map((queryKey) =>
          queryClient.invalidateQueries({
            queryKey,
            refetchType: 'all'
          })
        )
      )

      await Promise.all(
        keysToRefresh.map((queryKey) =>
          queryClient.refetchQueries({
            queryKey,
            type: 'all'
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
