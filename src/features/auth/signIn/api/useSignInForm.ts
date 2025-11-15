'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInForm, signInSchema } from '@/features/auth/signIn'
import { useLoginMutation } from '@/features/auth/signIn/api/useSignIn'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/shared/lib'

export const useSignInForm = () => {
  const router = useRouter()
  const { user } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    // reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' }
  })

  const { mutate, isPending } = useLoginMutation(setError)
  useEffect(() => {
    if (user?.userId) {
      router.replace(`/profile/${user.userId}`)
    }
  }, [user, router])

  const onSubmit = handleSubmit((data) => mutate(data))

  return { register, errors, isPending, onSubmit }
}
