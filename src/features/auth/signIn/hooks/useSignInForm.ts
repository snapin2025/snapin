import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMe } from './useMe'
import { useSignIn } from './useSignIn'
import type { SignInForm } from '../model'
import { signInSchema } from '../model'

export const useSignInForm = () => {
  const {
    register,
    setValue,
    clearErrors,
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

  return {
    register,
    setValue,
    clearErrors,
    errors,
    isPending,
    onSubmit
  }
}
