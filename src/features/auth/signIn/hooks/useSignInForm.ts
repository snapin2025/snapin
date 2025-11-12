'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SignInForm, signInSchema } from '@/features/auth/signIn'
import { useLoginMutation } from '@/features/auth/signIn/hooks/useSignIn'

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

  const { mutate, isPending } = useLoginMutation(setError)

  const onSubmit = handleSubmit((data) => mutate(data))

  return {
    register,
    errors,
    isPending,
    onSubmit
  }
}
