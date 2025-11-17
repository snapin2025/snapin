'use client'

import { useState } from 'react'
import { EmailSentModal } from '@/features/auth/ui/EmailSentModal'
import s from './RegisterPage.module.css'
import { SignUpErrorResponse } from '@/entities/user/api/user-types'
import { SignUp, SignUpForm, useSignUp } from '@/features/auth'

export function RegisterPage() {
  const { mutateAsync, isPending, error } = useSignUp()
  const [emailForModal, setEmailForModal] = useState<string | null>(null)

  let errorMessage: string | null = null

  if (error) {
    if ('messages' in error) {
      errorMessage = error.messages?.[0]?.message ?? null
    } else {
      errorMessage = error.message
    }
  }

  const handleRegister = async (formData: SignUpForm) => {
    try {
      const result = await mutateAsync({
        userName: formData.userName,
        email: formData.email,
        password: formData.password
      })

      if (result && 'statusCode' in result && result.statusCode === 204) {
        setEmailForModal(formData.email)
      }
      return result
    } catch (err) {
      console.log(err)
      const e = err as Error | SignUpErrorResponse
      if ('messages' in e) {
        e.messages.forEach(({ field, message }) => {
          // Можно передавать ошибки в форму через setError
          console.log(`Field: ${field}, Error: ${message}`)
        })
      }
      return err as SignUpErrorResponse
    }
  }

  return (
    <>
      <SignUp onSubmit={handleRegister} isLoading={isPending} error={errorMessage} />
      {emailForModal && <EmailSentModal email={emailForModal} onClose={() => setEmailForModal(null)} />}
    </>
  )
}
