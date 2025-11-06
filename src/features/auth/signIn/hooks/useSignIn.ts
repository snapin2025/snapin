import { useMutation } from '@tanstack/react-query'
import { signIn } from '../api'
import type { SignInRequest, SignInResponse } from '../api'

export const useSignIn = () => {
  const mutation = useMutation<SignInResponse, unknown, SignInRequest>({
    mutationFn: signIn
  })

  return mutation
}
