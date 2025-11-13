'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendRecoveryEmail } from '../api'

export const useForgotPassword = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sendRecoveryEmail
    // onSuccess: (data, variables) => {
    //   queryClient.setQueryData(['recovery-email'], variables)
    // }
  })
}
