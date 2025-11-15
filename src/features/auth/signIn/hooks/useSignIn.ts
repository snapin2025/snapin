'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signIn, SignInForm } from '@/features/auth/signIn'
import { UseFormSetError } from 'react-hook-form'
import { handleFormErrors } from '@/shared/lib/errors'

export const useLoginMutation = (setError: UseFormSetError<SignInForm>) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken)
      }
      qc.invalidateQueries({ queryKey: ['me'] })
    },
    onError: (error) => handleFormErrors(error, setError, 'password')

    // onError: (error: AxiosError<SignInErrorResponse>) => {
    //   const message = error.response?.data?.messages || 'Authentication failed'
    //   setError('password', { type: 'server', message })
    // }
  })
}
