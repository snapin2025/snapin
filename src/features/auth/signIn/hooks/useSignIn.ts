'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getMe, signIn, SignInErrorResponse, SignInForm } from '@/features/auth/signIn'
import { useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import { UseFormSetError } from 'react-hook-form'

export const useLoginMutation = (setError: UseFormSetError<SignInForm>) => {
  const qc = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: signIn,
    onSuccess: async (data) => {
      localStorage.setItem('accessToken', data.accessToken)

      const userData = await qc.fetchQuery({
        queryKey: ['me'],
        queryFn: getMe
      })
      if (userData?.userId) {
        router.push(`/profile/${userData.userId}`)
      }
    },
    onError: (error: AxiosError<SignInErrorResponse>) => {
      const message = error.response?.data?.messages || 'Authentication failed'
      setError('password', { type: 'server', message })
    }
  })
}

