import Link from 'next/link'
import s from './ForgotPasswordForm.module.css'

export const ForgotPasswordForm = () => {
  return (
    <div className={s.container}>
      <div className={s.form}>
        <h2 className={s.title}>Forgot Password</h2>

        {/* Email поле */}
        <div className={s.field}>
          <Input label="Email" type="email" placeholder="Enter your email" required />
        </div>

        <p className={s.text}>Enter your email address and we will send you further instructions</p>

        {/* Капча - оставляем как было! */}
        <div className={s.captcha}>
          <div className={s.captchaPlaceholder}>CAPTCHA</div>
        </div>

        {/* Чекбокс (если нужен дополнительно) */}
        <div className={s.checkboxContainer}>
          <Checkbox label="I agree to receive instructions" name="agreement" />
        </div>

        {/* Кнопка отправки */}
        <Button variant="primary" fullWidth className={s.button}>
          Send Instructions
        </Button>

        {/* Ссылка назад */}
        <Link href="/signin" className={s.backLink}>
          ← Back to Sign In
        </Link>
      </div>
    </div>
  )
}
