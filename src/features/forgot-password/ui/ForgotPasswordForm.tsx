import Link from 'next/link'
import { Input } from '@/shared/ui/input/input'
import { Button } from '@/shared/ui/button/Button'
import s from './ForgotPasswordForm.module.css'
import { Card } from '@/shared/ui'

export const ForgotPasswordForm = () => {
  return (
    <Card as="form" className={s.form}>
      <h2 className={s.title}>Forgot Password</h2>

      {/* Email поле */}
      <div className={s.field}>
        <Input id="email" label="Email" type="email" placeholder="Epam@epam.com" />
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
          <svg width="30" height="30" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_i_92001_469)">
              <path
                d="M26.4407 24.5068L21.3559 19.9305C20.339 20.9475 18.8136 22.9814 14.7458 22.9814C10.678 22.9814 9.15254 20.9475 7.62712 19.422L11.1864 15.3542H0V27.5576L3.05085 24.5068C4.57627 26.0322 9.05085 30.1 14.7458 30.1C20.4407 30.1 24.7458 26.2017 26.4407 24.5068Z"
                fill="#B5B6B5"
              />
            </g>
            <g filter="url(#filter1_i_92001_469)">
              <path
                d="M14.2373 12.3034L10.678 8.2356C7.11865 10.2695 6.44068 13.8288 6.61017 15.3542H0C0 14.3373 0.0980008 11.0414 1.01695 8.74407C2.0339 6.2017 4.23729 4.50679 5.59322 3.65933L2.54238 0.100006H14.2373L14.2373 12.3034Z"
                fill="#4D8DF4"
              />
            </g>
            <g filter="url(#filter2_i_92001_469)">
              <path
                d="M18.3051 14.8456L21.8644 11.2864C19.8305 7.72713 15.9322 7.21854 14.2373 7.21857V0.100006C15.7627 0.100014 19.8305 0.608481 21.8644 2.1339C23.762 3.55705 25.2543 5.18463 25.9322 6.20158L29.4915 3.15073V14.8456H18.3051Z"
                fill="#1B3CAC"
              />
            </g>
            <path
              d="M18.3051 14.8456L21.8644 11.2864C19.8305 7.72713 15.9322 7.21854 14.2373 7.21857V0.100006C15.7627 0.100014 19.8305 0.608481 21.8644 2.1339C23.762 3.55705 25.2543 5.18463 25.9322 6.20158L29.4915 3.15073V14.8456H18.3051Z"
              stroke="black"
              strokeWidth="0.2"
            />
            <defs>
              <filter
                id="filter0_i_92001_469"
                x="0"
                y="14.3542"
                width="27.4409"
                height="15.7457"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="1" dy="-1" />
                <feGaussianBlur stdDeviation="0.5" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.2 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_92001_469" />
              </filter>
              <filter
                id="filter1_i_92001_469"
                x="0"
                y="-0.900024"
                width="15.2373"
                height="16.2543"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="1" dy="-1" />
                <feGaussianBlur stdDeviation="0.5" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_92001_469" />
              </filter>
              <filter
                id="filter2_i_92001_469"
                x="14.1372"
                y="-1"
                width="16.4541"
                height="15.9456"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dx="1" dy="-1" />
                <feGaussianBlur stdDeviation="0.5" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_92001_469" />
              </filter>
            </defs>
          </svg>
          <div className={s.captchaTextWrapper}>
            <span className={s.captchaLine1}>reCAPTCHA</span>
            <span className={s.captchaLine2}>Privacy - Terms</span>
          </div>
          {/*<span className={s.captchaBrand}>reCAPTCHA Privacy - Terms</span>*/}
        </div>
      </div>
    </Card>
  )
}
