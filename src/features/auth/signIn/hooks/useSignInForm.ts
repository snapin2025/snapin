'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SignInForm, signInSchema, useMe, useSignIn } from '@/features/auth/signIn'

export const useSignInForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' }
  })

  const router = useRouter()
  const { mutateAsync, isPending } = useSignIn()
  const { refetch } = useMe()

  const onSubmit = handleSubmit(async (data) => {
    try {
      await mutateAsync(data)
      const { data: me } = await refetch()
      if (me?.userId) {
        router.push(`/profile/${me.userId}`)
      }
    } catch (e) {
      const error = e as { response?: { data?: { messages?: string } } }
      const message = error?.response?.data?.messages || 'Authentication failed'
      setError('password', { type: 'server', message })
    }
  })

  return { register, errors, isPending, onSubmit }
}
