import Link from 'next/link'
import { Input } from '@/shared/ui/input/input'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { Card } from '@/shared/ui'
import { CaptchaIcon } from '@/shared/ui/assets/icons/captcha'

import { useForm } from 'react-hook-form'

type ForgotPasswordInputs = {
  email: string
}
export const ForgotPasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordInputs>({
    defaultValues: { email: '' }
  })

  return (
    <Card as="form" className={s.form}>
      <h2 className={s.title}>Forgot Password</h2>

      {/* Email поле */}
      <div className={s.field}>
        <Input id="email" label="Email" type="email" placeholder="Epam@epam.com" {...register('email')} />
      </div>
      <p className={s.text}>Enter your email address and we will send you further instructions</p>

      {/* Кнопка отправки */}
      <Button variant="primary" type={'submit'} className={s.button}>
        Send Link
      </Button>

      {/* Ссылка назад */}
      <Link href="/signin" className={s.backLink}>
        Back to Sign In
      </Link>

      {/* Капча с полной структурой */}
      <div className={s.captchaContainer}>
        {/* Чекбокс слева */}
        <label className={s.captchaLabel}>
          <input type="checkbox" name="captcha" className={s.captchaCheckbox} />
          <span className={s.checkboxText}>I&apos;m not a robot</span>
        </label>

        {/* Капча справа с иконкой и текстом */}
        <div className={s.captchaLogo}>
          <CaptchaIcon /> {/* ← ЗАМЕНИ ВЕСЬ SVG НА ЭТУ КОМПОНЕНТУ */}
          <div className={s.captchaTextWrapper}>
            <span className={s.captchaLine1}>reCAPTCHA</span>
            <span className={s.captchaLine2}>Privacy - Terms</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
