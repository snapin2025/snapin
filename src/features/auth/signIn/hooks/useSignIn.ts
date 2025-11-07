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

// export const useSignIn = () => {
//   const queryClient = useQueryClient()
//
//   const { mutateAsync, isPending } = useMutation<SignInResponse, Error, SignInData>({
//     mutationKey: ['signIn'],
//     mutationFn: signIn,
//     onSuccess: (data) => {
//       if (typeof window !== 'undefined' && data?.accessToken) {
//         localStorage.setItem('accessToken', data.accessToken)
//       }
//       queryClient.invalidateQueries({ queryKey: ['me'] })
//     },
//     onError: (error) => {
//       console.error('Sign-in error:', error)
//       // обработка UI-ошибки
//     },
//   })
//
//   return { mutateAsync, isPending }
// }
