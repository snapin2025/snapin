import s from './Recaptcha.module.css'
import { Captch, Checkbox } from '@/shared/ui'

export type RecaptchaProps = {
  onVerify: () => void
  onError: () => void
}

export const Recaptcha = ({ onVerify, onError }: RecaptchaProps) => {
  // дабавила проверку если чекбокс нажат
  const handleCheckbox = (checked: boolean) => {
    if (checked) {
      onVerify() // Говорим форме что капча пройдена
    } else {
      onError()
    }
  }
  return (
    <div className={s.captchaContainer}>
      <label className={s.captchaLabel}>
        <Checkbox
          name="captcha"
          className={s.captchaCheckbox}
          onCheckedChange={(checked) => handleCheckbox(!!checked)}
        />
        <span className={s.checkboxText}>I&apos;m not a robot</span>
      </label>

      <div className={s.captchaLogo}>
        <Captch />
        <div className={s.captchaTextWrapper}>
          <span className={s.captchaLine1}>reCAPTCHA</span>
          <span className={s.captchaLine2}>Privacy-Terms</span>
        </div>
      </div>
    </div>
  )
}
