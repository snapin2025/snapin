'use client'

import s from './ForgotPasswordForm.module.css'
import { Button, Resend, Typography } from '@/shared/ui'
import { useResendRecoveryEmail } from '../hooks/use-reset-password'
import { useQueryClient } from '@tanstack/react-query'

import { Dialog, DialogContent } from '@/shared/ui'
import { useState } from 'react'

export default function LinkOldPage() {
  const queryClient = useQueryClient()
  const savedEmail = queryClient.getQueryData<string>(['recovery-email'])
  const [showModal, setShowModal] = useState(false) // ← модалка

  const { mutate: resendEmail, isPending } = useResendRecoveryEmail()

  const handleResend = () => {
    if (!savedEmail) {
      console.error('Email not found')
      return
    }
    resendEmail(savedEmail, {
      onSuccess: () => {
        // ✔ показываем сообщение по ТЗ (шаг 5)
        setShowModal(true)
      }
    })
  }

  return (
    <>
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
            {isPending ? 'Sending' : 'Resend link'}
          </Button>
          <Resend className={s.illustration} width={473} height={352} />
          {/*<Image className={s.illustration} src="/imgs/password.png" alt="Expired link" width={473} height={352} />*/}
        </div>
      </div>
      {/*МОДАЛЬНОЕ ОКНО, как требует ТЗ (шаг 5–7) */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent title="Email sent" showCloseButton={true}>
          <p className={s.textModal}>We have sent a link to confirm your email to {savedEmail}</p>

          <Button className={s.buttonModal} onClick={() => setShowModal(false)}>
            Ok
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
