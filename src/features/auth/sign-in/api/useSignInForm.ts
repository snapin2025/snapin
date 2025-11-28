'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useAuth } from '@/shared/lib'
import { useLoginMutation } from './useSignIn'
import { SignInForm, signInSchema } from '../model/validation'

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
