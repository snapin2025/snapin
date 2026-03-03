// хук для лайков
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateLikeStatus } from '../api/likePost'
import { LikeStatus } from './types'
import { LikeStatusSchema } from '@/features/posts/view-post/model/validations'

export const useLikePost = (postId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (likeStatus: LikeStatus) => {
      LikeStatusSchema.parse(likeStatus) // ✅ валидируем статус
      return updateLikeStatus(postId, likeStatus)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
    }
  })
}
