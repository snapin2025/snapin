'use client'

import s from './ForgotPasswordForm.module.css'
import Image from 'next/image'
import { Button, Typography } from '@/shared/ui'
import { useResendRecoveryEmail } from '../hooks/use-reset-password'
import { useQueryClient } from '@tanstack/react-query'

export default function LinkOldPage() {
  const queryClient = useQueryClient()
  const savedEmail = queryClient.getQueryData<string>(['recovery-email'])

  const { mutate: resendEmail, isPending } = useResendRecoveryEmail()

  const handleResend = () => {
    if (!savedEmail) {
      // ← ДОБАВИТЬ проверку
      console.error('Email not found')
      return
    }
    resendEmail(savedEmail, {
      // ← ИСПОЛЬЗОВАТЬ сохраненный email
      onSuccess: () => {
        console.log('Письмо отправлено повторно!')
      }
    })
  }

  return (
    <div className={s.container}>
      <div className={s.contentPage}>
        <Typography variant="h1">Email verification link expired</Typography>
        <p className={s.textPage}>
          Looks like the verification link has expired. Not to worry, we can send the link again
        </p>
        <Button
          className={s.buttonPage}
          // type="submit"
          onClick={handleResend}
          disabled={isPending}
        >
          {isPending ? 'Sending...' : 'Resend link'}
        </Button>
        <Image className={s.illustration} src="/imgs/password.png" alt="Expired link" width={473} height={352} />
      </div>
    </div>
  )
}
