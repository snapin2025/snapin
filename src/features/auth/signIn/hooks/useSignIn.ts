import { useMutation } from '@tanstack/react-query'
import { signIn } from '../api'

export const useSignIn = () => {
  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      if (typeof window !== 'undefined' && data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken)
      }
    }
  })

  return mutation
}
