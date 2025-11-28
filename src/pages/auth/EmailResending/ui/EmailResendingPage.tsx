'use client'

import { useSearchParams } from 'next/navigation'
import { useEmailResending } from '@/features/auth/emailResending'
import { useState } from 'react'
import { Button, Input, Resending, Typography } from '@/shared/ui'
import s from './EmailResendingPage.module.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmailResendingForm, EmailResendingSchema } from '@/pages/auth/EmailResending/model'
import { EmailSentModal } from '@/features/auth/ui/EmailSentModal'

export function EmailResendingPage() {
  const searchParams = useSearchParams()
  const emailParam = searchParams?.get('email') ?? ''
  const { mutateAsync, isPending } = useEmailResending()
  const [openModalEmail, setOpenModalEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EmailResendingForm>({
    defaultValues: { email: emailParam },
    resolver: zodResolver(EmailResendingSchema),
    mode: 'onBlur'
  })

  const handleResend = async (data: EmailResendingForm) => {
    const email = data.email || emailParam
    if (!email) {
      return
    }

    try {
      await mutateAsync({
        email,
        baseUrl: 'http://localhost:3000'
      })
      setOpenModalEmail(email)
    } catch (err: any) {
      if ('messages' in err) {
        alert(err.messages?.[0]?.message ?? 'Something went wrong')
      } else {
        alert(err.message ?? 'Something went wrong')
      }
    }
  }

  return (
    <div className={s.wrapperEmailResending}>
      <Typography variant="h1">Email verification link expired</Typography>
      <Typography className={s.resendingMessage} variant="regular_16">
        Looks like the verification link has expired. Not to worry, we can send the link again
      </Typography>

      <form className={s.form} onSubmit={handleSubmit(handleResend)}>
        <Input
          label={'Email'}
          id={'email'}
          placeholder={'Epam@epam.com'}
          type={'email'}
          error={errors.email?.message}
          {...register('email')}
        />
        <Button className={s.button} variant={'primary'} type="submit" disabled={isPending}>
          <Typography variant="h3">Resend verification link</Typography>
        </Button>
      </form>

      <Resending />

      {openModalEmail && <EmailSentModal email={openModalEmail} onClose={() => setOpenModalEmail(null)} />}
    </div>
  )
}
