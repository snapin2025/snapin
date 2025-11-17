'use client'

import Link from 'next/link'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { Card, Input, Typography } from '@/shared/ui'
import { useResendRecoveryEmail } from '../hooks/use-reset-password'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmailOnlyInputs, emailOnlySchema } from '@/features/auth/forgot-password/model/validateInput'
import { useState } from 'react'

import { Dialog, DialogContent } from '@/shared/ui' // путь к вашей универсальной модалке

type Props = {
  onResendClick?: () => void
}

export const EmailSentMessage = ({ onResendClick }: Props) => {
  const queryClient = useQueryClient()
  const savedEmail = queryClient.getQueryData<string>(['recovery-email'])
  const [showModal, setShowModal] = useState(false) // ← ДОБАВИЛ состояние для модалки

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid } // ✔ Добавили isValid для дизейбла кнопки
  } = useForm<EmailOnlyInputs>({
    // ✔ Используем готовую схему emailOnlySchema для формы без капчи
    resolver: zodResolver(emailOnlySchema),
    mode: 'onChange', // ✔ Чтобы isValid обновлялся при изменении поля
    defaultValues: {
      email: savedEmail || ''
    }
  })

  const { mutate: resendEmail, isPending } = useResendRecoveryEmail()

  const onSubmit: SubmitHandler<EmailOnlyInputs> = (data) => {
    resendEmail(data.email, {
      onSuccess: () => {
        console.log('Письмо отправлено повторно!')
        setShowModal(true) // ← ИЗМЕНИЛ: показываем нашу модалку вместо вызова пропса
        onResendClick?.() // ← показываем модалку
        reset()
      }
    })
  }

  return (
    <>
      <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h1">Forgot Password</Typography>
        <div className={s.field}>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="Epam@epam.com"
            error={!!errors.email}
            {...register('email')}
          />
          {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}
        </div>

        <p className={s.text}>Enter your email address and we will send you further instructions</p>

        <p className={s.textLink}>
          The link has been sent by email. If you don&apos;t receive an email send link again
        </p>

        {/*изменим обшую кнопку для разных состояний*/}
        {/* ✔ UC-3 шаг 4: кнопка дизейблится, если email пустой/невалидный или запрос отправки в процессе */}
        <Button variant="primary" className={s.button} type={'submit'} disabled={!isValid || isPending}>
          {isPending ? 'Sending' : 'Send Link Again'}
        </Button>

        <Link href="/sign-in" className={s.backLink}>
          Back to Sign In
        </Link>

        {/* форма ❌ БЕЗ капчи */}
      </Card>
      {/* ← ДОБАВИЛ универсальную модалку */}
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
