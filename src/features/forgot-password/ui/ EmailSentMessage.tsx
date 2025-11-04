import Link from 'next/link'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { Card, Input, Typography } from '@/shared/ui'

// Добавляем пропс
type Props = {
  onResendClick?: () => void
}
export const EmailSentMessage = ({ onResendClick }: Props) => {
  return (
    <Card className={s.form}>
      <Typography variant="h1">Forgot Password</Typography>
      <div className={s.field}>
        <Input id="email" label="Email" type="email" placeholder="Epam@epam.com" value="Epam@epam.com" />
      </div>

      <p className={s.text}>Enter your email address and we will send you further instructions</p>

      <p className={s.textlink}>The link has been sent by email. If you don&apos;t receive an email send link again</p>

      <Button variant="primary" className={s.button}>
        Send Link Again
      </Button>

      <Link href="/signin" className={s.backLink}>
        Back to Sign In
      </Link>

      {/* форма ❌ БЕЗ капчи */}
    </Card>
  )
}
