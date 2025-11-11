'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ConfirmErrorResponse, useConfirm } from '@/features/auth/confirm'
import { Button, Confirmed, Typography } from '@/shared/ui'
import Link from 'next/link'
import s from './ConfirmPage.module.css'

export function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { mutateAsync, isPending } = useConfirm()

  useEffect(() => {
    const code = searchParams?.get('code')
    const email = searchParams?.get('email')

    if (!code) {
      // alert('Confirmation code missing!')
      router.push('/auth/signUp')
      return
    }

    const confirm = async () => {
      try {
        await mutateAsync({ confirmationCode: code })
        alert('🎉 Congratulations! Your email has been confirmed!')
        router.push('/auth/signin')
      } catch (err) {
        const e = err as Error | ConfirmErrorResponse

        if ('messages' in e && e.messages?.[0]?.field === 'code') {
          router.push(`/auth/emailResending?email=${email ?? ''}`)
          return
        }
        if ('messages' in e) {
          alert(e.messages?.[0]?.message ?? 'Something went wrong')
        } else {
          alert(e.message ?? 'Something went wrong')
        }
        router.push('/auth/signUp')
      }
    }

    void confirm()
  }, [mutateAsync, router, searchParams])

  return (
    <div className={s.wrapperConfirm}>
      {/*{isPending ? 'Confirming your account...' : 'Redirecting...'}*/}
      <Typography variant="h1">Congratulations!</Typography>
      <Typography className={s.confirmMessage} variant="regular_16">
        Your email has been confirmed
      </Typography>

      <Link href={'/auth/signin'}>
        <Button className={s.button} variant={'primary'}>
          Sign In
        </Button>
      </Link>
      <Confirmed />
    </div>
  )
}
