'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ConfirmErrorResponse, useConfirm } from '@/features/auth/confirm'
import { Button, Confirmed, Typography } from '@/shared/ui'
import Link from 'next/link'
import s from './ConfirmPage.module.css'

export function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mutateAsync } = useConfirm()

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const code = searchParams?.get('code')
    const email = searchParams?.get('email')

    if (!code) {
      router.push('/sign-up')
      return
    }

    const confirm = async () => {
      try {
        await mutateAsync({ confirmationCode: code })
        setStatus('success')
      } catch (err) {
        const e = err as Error | ConfirmErrorResponse

        if ('messages' in e && e.messages?.[0]?.field === 'code') {
          router.push(`/emailResending?email=${email ?? ''}`)
          return
        }
        if ('messages' in e) {
          alert(e.messages?.[0]?.message ?? 'Something went wrong')
        } else {
          alert(e.message ?? 'Something went wrong')
        }
        router.push('/sign-up')
      }
    }

    void confirm()
  }, [mutateAsync, router, searchParams])

  if (status === 'loading') {
    return (
      <div className={s.wrapperConfirm}>
        <Typography variant="h1">Checking your email...</Typography>
        <Typography className={s.confirmMessage} variant="regular_16">
          Please wait while we confirm your account
        </Typography>
      </div>
    )
  }

  return (
    <div className={s.wrapperConfirm}>
      <Typography variant="h1">Congratulations!</Typography>
      <Typography className={s.confirmMessage} variant="regular_16">
        Your email has been confirmed
      </Typography>

      <Link href={'/sign-in'}>
        <Button className={s.button} variant={'primary'}>
          Sign In
        </Button>
      </Link>
      <Confirmed />
    </div>
  )
}
