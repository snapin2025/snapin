'use client'
import { useMutation } from '@tanstack/react-query'
import { sendRecoveryEmail } from '../api'

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: sendRecoveryEmail
  })
}
