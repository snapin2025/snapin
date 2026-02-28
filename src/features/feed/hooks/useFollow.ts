// хук для подписки и откписки
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { followApi } from '../api/followApi'

export const useFollow = () => {
  const queryClient = useQueryClient()

  const followMutation = useMutation({
    mutationFn: (userId: number) => followApi.follow({ selectedUserId: userId }),
    onSuccess: (_, userId) => {
      // Инвалидируем кэш ленты и профиля пользователя
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: (error) => {
      console.error('Failed to follow user:', error)
    }
  })

  const unfollowMutation = useMutation({
    mutationFn: (userId: number) => followApi.unfollow({ userId }),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: (error) => {
      console.error('Failed to unfollow user:', error)
    }
  })

  return {
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isFollowing: followMutation.isPending,
    isUnfollowing: unfollowMutation.isPending
  }
}
