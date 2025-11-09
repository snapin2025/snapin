import { useMutation } from '@tanstack/react-query';
import { confirm, ConfirmErrorResponse, ConfirmRequest } from '@/features/auth/confirm';


export const useConfirm = () => {
  return useMutation<void, Error | ConfirmErrorResponse, ConfirmRequest>({
    mutationFn: async (payload) => {
      try {
        await confirm(payload)
        return
      } catch (err: any) {
        if (err.response?.data) {
          throw err.response.data as ConfirmErrorResponse
        }
        throw err
      }
    },
  })
}
