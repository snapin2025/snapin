import { useMutation } from '@tanstack/react-query'
import { SignUpErrorResponse, SignUpRequest, SignUpResponse } from '@/entities/user'
import { userApi } from '@/entities/user'

export const useSignUp = () => {
  return useMutation<SignUpResponse, Error | SignUpErrorResponse, SignUpRequest>({
    mutationFn: async (payload) => {
      try {
        const res = await userApi.signUp(payload)
        return res
      } catch (err: any) {
        if (err.response?.data) {
          throw err.response.data as SignUpErrorResponse
        }
        throw err
      }
    }
  })
}
