import { useQuery } from '@tanstack/react-query'
import { commentKeys } from './queryKeys'
import { postsApi } from '../api'
import { GetAnswersParams } from '../api/types'

export const useAnswers = (params: GetAnswersParams) => {
  const { postId, commentId, pageSize = 6 } = params

  return useQuery({
    queryKey: commentKeys.answersList(postId, commentId, pageSize),

    queryFn: () =>
      postsApi.getAnswers({
        postId,
        commentId,
        pageSize
      }),

    enabled: !!postId && !!commentId
  })
}
