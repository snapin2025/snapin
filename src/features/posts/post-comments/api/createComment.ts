//  запрос для написание коментарй к публикации
import { api } from '@/shared/api'
import { CreateCommentParams, CreateCommentResponse } from '../model/types'

export const createComment = ({ postId, content }: CreateCommentParams) => {
  return api.post<CreateCommentResponse>(`/posts/${postId}/comments`, {
    content
  })
}
