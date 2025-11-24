'use client'

import { Button, Resend, Typography } from '@/shared/ui'
import { useQueryClient } from '@tanstack/react-query'
import { useResendRecoveryEmail } from '../api/useResetPassword'
import s from './ForgotPasswordForm.module.css'
import { ROUTES } from '@/shared/lib/routes'
import { useRouter, useSearchParams } from 'next/navigation' // ← ДОБАВИЛ useSearchParams

export default function LinkOldPage() {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams() // ← ДОБАВИЛ получение searchParams
  const savedEmail = queryClient.getQueryData<string>(['recovery-email'])
  const emailFromUrl = searchParams?.get('email') // ← ДОБАВИЛ получение email из URL
  const { mutate: resendEmail, isPending } = useResendRecoveryEmail()
  const router = useRouter() //создаю экземпляр хука

  const handleResend = () => {
    // ← ДОБАВИЛ проверку обоих источников email
    const emailToUse = savedEmail || emailFromUrl

    if (!emailToUse) {
      alert('Email not found. Please enter your email again.')
      router.replace(ROUTES.AUTH.FORGOT_PASSWORD)
      return
    }
    // if (!savedEmail) {
    //   console.log('savedEmail:', savedEmail) // ← добавить перед if (!savedEmail)
    //   alert('Email not found. Please enter your email again.')
    //   //дабавила реддирект
    //   // router.replace(ROUTES.AUTH.RESEND_NEW_PASSWORD_LINK)
    //   router.replace(ROUTES.AUTH.FORGOT_PASSWORD) // ← на форму с капчей (если email не найден)
    //   return
    // }

    resendEmail(
      {
        // email: savedEmail,
        email: emailToUse, // ← ИСПРАВИЛа используем найденный email
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${ROUTES.AUTH.CREATE_NEW_PASSWORD}` //обязательно передаем baseUrl
      },
      {
        onSuccess: () => {
          alert(`We have sent a link to confirm your email to ${emailToUse}`) // ← ИСПРАВИТЬ savedEmail на emailToUse
          // alert(`We have sent a link to confirm your email to ${savedEmail}`)
          // router.replace(ROUTES.AUTH.RESEND_NEW_PASSWORD_LINK) // редирект на страницу "Email sent"
        },
        // ← ДОБАВИЛа обработку ошибки
        onError: (err) => {
          alert('Failed to send email. Please try again.')
          console.error('Resend error:', err)
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
          {/*картинка*/}
          <Resend className={s.illustration} width={473} height={352} />
        </div>
      </div>
    </>
  )
}
