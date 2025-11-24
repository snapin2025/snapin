// 'use client'
//
// import Link from 'next/link'
// import { Card, Input, Typography } from '@/shared/ui'
// import { Button } from '@/shared/ui/button/Button'
// import s from './ForgotPasswordForm.module.css'
// import { SubmitHandler, useForm } from 'react-hook-form'
// import { useRef, useState } from 'react'
// import { zodResolver } from '@hookform/resolvers/zod'
// import ReCAPTCHA from 'react-google-recaptcha'
// import { AxiosError } from 'axios'
// import { ROUTES } from '@/shared/lib/routes'
// import { useQueryClient } from '@tanstack/react-query'
// import { ForgotPasswordInputs, inputEmailSchema } from '../model/validateInput'
// import { useForgotPassword } from '../api/useForgotPassword'
//
// export const ForgotPasswordForm = () => {
//   const queryClient = useQueryClient() // <- вот здесь получаем
//   const [recaptchaToken, setRecaptchaToken] = useState<string>('')
//   const recaptchaRef = useRef<ReCAPTCHA | null>(null)
//   // const savedEmail = useQueryClient().getQueryData<string>(['recovery-email']) ?? ''
//   // const router = useRouter()
//   const {
//     register,
//     reset,
//     handleSubmit,
//     setError,
//     formState: { errors, isValid } // ✔ Добавлено isValid для дизейбла кнопки
//   } = useForm<ForgotPasswordInputs>({
//     resolver: zodResolver(inputEmailSchema),
//     mode: 'onChange', // ✔ Включаем onChange чтобы isValid обновлялся при вводе
//     defaultValues: { email: '', recaptcha: '' }
//   })
//
//   const { mutate: sendRecoveryEmail, isPending } = useForgotPassword()
//
//   const onSubmit: SubmitHandler<ForgotPasswordInputs> = (data) => {
//     if (!recaptchaToken) return
//     // ✔ Сбрасываем предыдущую ошибку перед новым запросом
//
//     sendRecoveryEmail(
//       {
//         email: data.email,
//         recaptcha: recaptchaToken,
//         baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${ROUTES.AUTH.CREATE_NEW_PASSWORD}`
//       },
//       {
//         onSuccess: () => {
//           //дописала
//           // Сохраняем email в queryClient
//           queryClient.setQueryData(['recovery-email'], data.email) // сохраняем email
//           reset({ email: '', recaptcha: '' })
//           recaptchaRef.current?.reset()
//           // было -так делать не льзя так как Проблема: при первом запросе savedEmail может быть пустым.
//           // alert(`We have sent a link to confirm your email to ${savedEmail}`)
//
//           alert(`We have sent a link to confirm your email to ${data.email}`)
//           // router.replace(ROUTES.AUTH.RESEND_NEW_PASSWORD_LINK)
//         },
//         onError: (
//           err: AxiosError<{
//             statusCode: number
//             messages: { message: string; field: string }[]
//           }>
//         ) => {
//           const serverMessage = err.response?.data?.messages?.[0]?.message || 'Something went wrong'
//           setError('email', { type: 'server error', message: serverMessage })
//         }
//       }
//     )
//   }
//
//   return (
//     <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
//       <Typography variant="h1">Forgot Password</Typography>
//       <div className={s.field}>
//         <Input
//           id="email"
//           label="Email"
//           type="email"
//           placeholder="Epam@epam.com"
//           error={!!errors.email}
//           {...register('email')}
//         />
//         {/*С этим исправлением показываются и ошибки валидации, и ошибки от сервера.*/}
//         {errors.email?.message && <span className={s.errorMessage}>{errors.email.message}</span>}
//       </div>
//       <p className={s.text}>Enter your email address and we will send you further instructions</p>
//       {/* ✔ Кнопка теперь дизейблится, если форма не валидна или капча не пройдена */}
//       <Button
//         variant="primary"
//         type={'submit'}
//         className={s.button}
//         disabled={!isValid || !recaptchaToken || isPending} // ✔ UC-3: шаг 4
//       >
//         {isPending ? 'Sending' : 'Send Link'}
//       </Button>
//       <Link href={ROUTES.AUTH.SIGN_IN} className={s.backLink}>
//         Back to Sign In
//       </Link>
//       <div className={s.captchaContainer}>
//         {/*это сама капча  гугла  */}
//         {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
//           <ReCAPTCHA
//             className={s.captchaContainer}
//             ref={recaptchaRef}
//             sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
//             onChange={(token) => setRecaptchaToken(token ?? '')}
//             onExpired={() => setRecaptchaToken('')}
//             theme="dark"
//             hl="en"
//           />
//         )}
//       </div>
//     </Card>
//   )
// }
'use client'

import Link from 'next/link'
import { Card, Input, Typography } from '@/shared/ui'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import ReCAPTCHA from 'react-google-recaptcha'
import { AxiosError } from 'axios'
import { ROUTES } from '@/shared/lib/routes'
import { useQueryClient } from '@tanstack/react-query'
import { ForgotPasswordInputs, inputEmailSchema, EmailOnlyInputs, emailOnlySchema } from '../model/validateInput'
import { useForgotPassword } from '../api/useForgotPassword'
import { useResendRecoveryEmail } from '../api/useResetPassword'
import { useSearchParams } from 'next/navigation'

type FormState = 'initial' | 'emailSent'

export const ForgotPasswordForm = () => {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams() // ← ДОБАВИТЬ
  const [formState, setFormState] = useState<FormState>('initial')
  const [recaptchaToken, setRecaptchaToken] = useState<string>('')
  const [recaptchaExpired, setRecaptchaExpired] = useState(false) // ← ДОБАВИТЬ
  const recaptchaRef = useRef<ReCAPTCHA | null>(null)

  // Получаем email из URL
  const emailFromUrl = searchParams?.get('email') || ''

  // Если пришли с email в URL - сразу показываем форму без капчи
  useEffect(() => {
    if (emailFromUrl) {
      setFormState('emailSent')
      queryClient.setQueryData(['recovery-email'], emailFromUrl)
    }
  }, [emailFromUrl, queryClient])

  // Для начальной формы (с капчей)
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors: initialErrors, isValid: initialIsValid }
  } = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(inputEmailSchema),
    mode: 'onChange',
    defaultValues: { email: '', recaptcha: '' }
  })

  // Для формы повторной отправки (без капчи)
  const {
    register: registerResend,
    handleSubmit: handleResendSubmit,
    formState: { errors: resendErrors, isValid: resendIsValid }
  } = useForm<EmailOnlyInputs>({
    resolver: zodResolver(emailOnlySchema),
    mode: 'onChange',
    defaultValues: {
      email: emailFromUrl || '' // ← добавила  подстановку email из URL
    }
  })

  const { mutate: sendRecoveryEmail, isPending: isSending } = useForgotPassword()
  const { mutate: resendEmail, isPending: isResending } = useResendRecoveryEmail()

  // Обработчик для начальной отправки
  const onSubmitInitial: SubmitHandler<ForgotPasswordInputs> = (data) => {
    // console.log('🔍 BEFORE REQUEST - Token:', recaptchaToken?.substring(0, 10) + '...')
    // console.log('🔍 BEFORE REQUEST - Email:', data.email)
    if (!recaptchaToken) return

    sendRecoveryEmail(
      {
        email: data.email,
        recaptcha: recaptchaToken,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${ROUTES.AUTH.CREATE_NEW_PASSWORD}`
      },
      {
        onSuccess: () => {
          // console.log('✅ REQUEST SUCCESS')
          queryClient.setQueryData(['recovery-email'], data.email)
          reset({ email: '', recaptcha: '' })
          recaptchaRef.current?.reset()
          setRecaptchaToken('')
          setRecaptchaExpired(false) // ← СБРОСИТЬ при успешной отправке
          setFormState('emailSent')
          alert(`We have sent a link to confirm your email to ${data.email}`)
        },
        onError: (
          err: AxiosError<{
            statusCode: number
            messages: { message: string; field: string }[]
          }>
        ) => {
          // console.log('❌ REQUEST ERROR:', err) // ← ИСПРАВИТЬ: onError
          const serverMessage = err.response?.data?.messages?.[0]?.message || 'Something went wrong'
          setError('email', { type: 'server error', message: serverMessage })
        }
      }
    )
  }

  // Обработчик для повторной отправки
  const onSubmitResend: SubmitHandler<EmailOnlyInputs> = (data) => {
    resendEmail(
      {
        email: data.email,
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${ROUTES.AUTH.CREATE_NEW_PASSWORD}`
      },
      {
        onSuccess: () => {
          queryClient.setQueryData(['recovery-email'], data.email)
          alert(`We have sent a link to confirm your email to ${data.email}`)
        },
        onError: (err: unknown) => {
          const message =
            err instanceof AxiosError
              ? (err.response?.data?.messages?.[0]?.message ?? 'Something went wrong. Please enter your email again.')
              : 'Something went wrong. Please enter your email again.'
          alert(message)
        }
      }
    )
  }

  // Рендер начальной формы (с капчей)
  if (formState === 'initial') {
    return (
      <Card as="form" className={s.form} onSubmit={handleSubmit(onSubmitInitial)}>
        <Typography variant="h1">Forgot Password</Typography>

        <div className={s.field}>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="Epam@epam.com"
            error={!!initialErrors.email}
            {...register('email')}
          />
          {initialErrors.email?.message && <span className={s.errorMessage}>{initialErrors.email.message}</span>}
        </div>

        <p className={s.text}>Enter your email address and we will send you further instructions</p>

        <Button
          variant="primary"
          type="submit"
          className={s.button}
          disabled={!initialIsValid || !recaptchaToken || isSending}
        >
          {isSending ? 'Sending' : 'Send Link'}
        </Button>

        <Link href={ROUTES.AUTH.SIGN_IN} className={s.backLink}>
          Back to Sign In
        </Link>

        <div className={s.captchaContainer}>
          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
            <>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                // onChange={(token) => setRecaptchaToken(token ?? '')}
                onChange={(token) => {
                  setRecaptchaToken(token ?? '')
                  setRecaptchaExpired(false) // ← СБРОСИТЬ при новой капче
                }}
                // onExpired={() => setRecaptchaToken('')}
                onExpired={() => {
                  setRecaptchaToken('')
                  setRecaptchaExpired(true) // ← ПОКАЗАТЬ сообщение
                }}
                onErrored={() => console.log('ReCAPTCHA load error')} // ← ПРОСТОЕ РЕШЕНИЕ: обработка ошибок
                theme="dark"
                hl="en"
              />
              {/* ← ДОБАВИТЬ сообщение об истечении */}
              {recaptchaExpired && <p className={s.errorMessage}>ReCAPTCHA expired. Please verify again.</p>}
            </>
          )}
        </div>
      </Card>
    )
  }

  // Рендер состояния "Email отправлен" (без капчи)
  return (
    <Card as="form" className={s.form} onSubmit={handleResendSubmit(onSubmitResend)}>
      <Typography variant="h1">Forgot Password</Typography>

      <div className={s.field}>
        <Input
          id="resend-email"
          label="Email"
          type="email"
          placeholder="Epam@epam.com"
          error={!!resendErrors.email}
          {...registerResend('email')}
        />
        {resendErrors.email?.message && <span className={s.errorMessage}>{resendErrors.email.message}</span>}
      </div>

      <p className={s.text}>Enter your email address and we will send you further instructions</p>

      {/* Сообщение о отправленном email */}
      <p className={s.textLink}>The link has been sent by email. If you dont receive an email send link again</p>

      <Button variant="primary" className={s.button} type="submit" disabled={!resendIsValid || isResending}>
        {isResending ? 'Sending' : 'Send Link Again'}
      </Button>

      <Link href={ROUTES.AUTH.SIGN_IN} className={s.backLink}>
        Back to Sign In
      </Link>
    </Card>
  )
}
