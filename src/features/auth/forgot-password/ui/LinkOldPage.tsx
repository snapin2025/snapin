'use client'

import { Button, Resend, Typography } from '@/shared/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useResendRecoveryEmail } from '../api/useResetPassword'
import s from './ForgotPasswordForm.module.css'
import { ROUTES } from '@/shared/lib/routes'

export default function LinkOldPage() {
  const queryClient = useQueryClient()
  const savedEmail = queryClient.getQueryData<string>(['recovery-email'])
  const { mutate: resendEmail, isPending } = useResendRecoveryEmail()
  console.log(savedEmail)
  const handleResend = () => {
    // if (!savedEmail) return

    resendEmail(
      {
        email: savedEmail!,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${ROUTES.AUTH.CREATE_NEW_PASSWORD}` //обязательно передаем baseUrl
      },
      {
        onSuccess: () => {
          alert(`We have sent a link to confirm your email to ${savedEmail}`)
        }
      }
    )
  }

  return (
    <>
      <div className={s.container}>
        <div className={s.contentPage}>
          <Typography variant="h1">Email verification link expired</Typography>
          <p className={s.textPage}>
            Looks like the verification link has expired. Not to worry, we can send the link again
          </p>
          <Button className={s.buttonPage} onClick={handleResend} disabled={isPending}>
            {isPending ? 'Sending' : 'Resend link'}
          </Button>
          <Resend className={s.illustration} width={473} height={352} />
        </div>
      </div>
    </>
  )
}
