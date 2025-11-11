'use client'

import { useSearchParams } from 'next/navigation'
import { useEmailResending } from '@/features/auth/emailResending'
import { useState } from 'react'
import { Button, Input, Resending, Typography } from '@/shared/ui'
import s from './EmailResendingPage.module.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmailResendingForm, EmailResendingSchema } from '@/pages/auth/EmailResending/model'

export function EmailResendingPage() {
  const searchParams = useSearchParams()
  const emailParam = searchParams?.get('email') ?? ''
  const { mutateAsync, isPending } = useEmailResending()
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EmailResendingForm>({
    defaultValues: { email: 'emailParam' },
    resolver: zodResolver(EmailResendingSchema),
    mode: 'onBlur'
  })

  const handleResend = async (data: EmailResendingForm) => {
    const email = data.email || emailParam
    if (!email) {
      setMessage('Missing email in request.')
      return
    }

    try {
      await mutateAsync({
        email,
        baseUrl: 'http://localhost:3000'
      })
      setMessage('✅ Verifi cation link has been resent! Check your email.')
    } catch (err: any) {
      if ('messages' in err) {
        setMessage(err.messages?.[0]?.message ?? 'Something went wrong')
      } else {
        setMessage(err.message ?? 'Something went wrong')
      }
    }
  }

  return (
    <div className={s.wrapperEmailResending}>
      {/*<h2>Looks like the verification link has expired...</h2>*/}
      {/*<p>Please request a new verification link.</p>*/}
      {/*<Button onClick={handleResend} disabled={isPending}>*/}
      {/*  Resend verification link*/}
      {/*</Button>*/}
      {/*{message && <p>{message}</p>}*/}
      {/*<Link href={'/auth/signUp'}>*/}
      {/*  <Button variant={'textButton'}>Back to Sign Up</Button>*/}
      {/*</Link>*/}
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
        <Button className={s.button} variant={'primary'} type="submit">
          <Typography variant="h3">Resend verification link</Typography>
        </Button>
      </form>

      <Resending />
    </div>
  )
}
