import { useMutation } from '@tanstack/react-query'
import { emailResending, emailResendingErrorResponse, emailResendingRequest } from '@/features/auth/emailResending'

export const useEmailResending = () => {
  return useMutation<void, Error | emailResendingErrorResponse, emailResendingRequest>({
    mutationFn: async (payload) => {
      try {
        await emailResending(payload)
        return
      } catch (err: any) {
        if (err.response?.data) {
          throw err.response.data as emailResendingErrorResponse
        }
        throw err
      }
    }
  })
}
