import { useMutation } from '@tanstack/react-query'
import { SignUpErrorResponse, SignUpRequest } from '@/entities/user'
import { userApi } from '@/entities/user'
import { AxiosError } from 'axios'

export const useSignUp = () => {
  return useMutation<void, AxiosError<SignUpErrorResponse>, SignUpRequest>({
    mutationFn: (payload) => userApi.signUp(payload)
  })
}

// try {
//   const res = await userApi.signUp(payload)
//   return res
// } catch (err: any) {
//   if (err.response?.data) {
//     throw err.response.data as SignUpErrorResponse
//   }
//   throw err
// }
