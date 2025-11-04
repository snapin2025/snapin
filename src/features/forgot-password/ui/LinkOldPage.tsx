import s from './ForgotPasswordForm.module.css'
import Image from 'next/image'
import { Button, Typography } from '@/shared/ui'

export default function LinkOldPage() {
  return (
    <div className={s.container}>
      <div className={s.content}>
        <Typography variant="h1">Email verification link expired</Typography>
        <p className={s.textPage}>
          Looks like the verification link has expired. Not to worry, we can send the link again
        </p>
        <Button className={s.buttonPage} type="submit">
          Resend link
        </Button>
        <Image className={s.illustration} src="/imgs/password.png" alt="Expired link" width={473} height={352} />
      </div>
    </div>
  )
}
