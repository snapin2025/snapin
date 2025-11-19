import { useMutation } from '@tanstack/react-query'
import { userApi } from '@/entities/user'
import { ConfirmErrorResponse, ConfirmRequest } from '@/entities/user/api/user-types'

export const useConfirm = () => {
  return useMutation<void, Error | ConfirmErrorResponse, ConfirmRequest>({
    mutationFn: async (payload) => {
      try {
        await userApi.confirm(payload)
        return
      } catch (err: any) {
        if (err.response?.data) {
          throw err.response.data as ConfirmErrorResponse
        }
        throw err
      }
    }
  })
}
