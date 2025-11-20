'use client'
import { CreateNewPassword, useCheckRecoveryCode } from '@/features/auth/forgot-password'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import LinkOldPage from '@/features/auth/forgot-password/ui/LinkOldPage'

export const CreateNewPasswordPage = () => {
  const { mutate: checkRecoveryCode, isPending, isError } = useCheckRecoveryCode()
  const params = useSearchParams()

  const recoveryCode = params?.get('code')

  useEffect(() => {
    if (recoveryCode) {
      checkRecoveryCode({ recoveryCode })
    }
  }, [checkRecoveryCode, recoveryCode])

  if (isError) {
    return <LinkOldPage />
  }

  return <CreateNewPassword />
}
