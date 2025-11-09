import { useMutation } from '@tanstack/react-query'
import { signIn } from '@/features/auth/signIn'

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

// export const useLoginMutation = () => {
//   const qc = useQueryClient()
//   return useMutation({
//     mutationFn: signIn
//       })
//
//     onSuccess: async (data) => {
//   localStorage.setItem('accessToken', data.accessToken)
//
//       await qc.invalidateQueries({ queryKey: ['auth', 'me'] })
//
//       await qc.invalidateQueries()
//     },
//
// }
