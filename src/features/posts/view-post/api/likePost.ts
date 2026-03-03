// запрос для лайков

// view-post/api/likePost.ts
import { LikeStatus } from '@/features/posts/view-post/model'
import { api } from '@/shared/api'

export const updateLikeStatus = (postId: number, likeStatus: LikeStatus) => {
  return api.put(`/posts/${postId}/like-status`, { likeStatus })
}
