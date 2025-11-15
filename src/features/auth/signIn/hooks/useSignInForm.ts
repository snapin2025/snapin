'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInForm, signInSchema } from '@/features/auth/signIn'
import { useLoginMutation } from '@/features/auth/signIn/hooks/useSignIn'
import { useAuth } from '@/shared/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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
      router.push(`/profile/${user.userId}`)
    }
  }, [user, router])

  const onSubmit = handleSubmit((data) => mutate(data))

  return { register, errors, isPending, onSubmit }
}
