import { ComponentPropsWithoutRef } from 'react'
import { Button } from '../button'
import s from './payment-button.module.css'
import { clsx } from 'clsx'

type PaymentButtonProps = {
  variant: 'paypal' | 'stripe'
} & ComponentPropsWithoutRef<'button'>

export const PaymentButton = ({ variant, className, children, ...rest }: PaymentButtonProps) => {
  return (
    <Button
      variant="secondary"
      className={clsx(s.paymentButton, s[variant], className)}
      {...rest}
    >
      {children || (variant === 'paypal' ? 'PayPal' : 'Stripe')}
    </Button>
  )
}

