// было
// import { ForgotPasswordForm } from '@/features/auth/forgot-password'
//
// export const ForgotPasswordPage = () => {
//   return <ForgotPasswordForm />
// }
// src/pages/forgot-password/index.tsx
//дописала логику  либо капча с формой либо без нее
'use client'
import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ForgotPasswordForm } from '@/features/auth/forgot-password'
import { EmailSentMessage } from '@/features/auth/forgot-password/ui/EmailSentMessage'

export const ForgotPasswordPage = () => {
  const queryClient = useQueryClient()

  // Берём сохранённый email (если есть)
  const savedEmail = queryClient.getQueryData<string>(['recovery-email']) ?? ''
  // Простая проверка: есть ли валидный непустой email
  const hasSavedEmail = savedEmail.trim().length > 0

  if (hasSavedEmail) {
    // Уже отправили — показываем форму БЕЗ капчи
    return <EmailSentMessage />
  }

  // Ещё не отправляли — первая отправка, показываем форму С капчей
  return <ForgotPasswordForm />
}
