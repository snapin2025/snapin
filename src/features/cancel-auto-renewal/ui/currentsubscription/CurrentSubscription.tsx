'use client'
import s from './CurrentSubscription.module.css'
import { Card, Checkbox, Typography } from '@/shared/ui'

export type CurrentSubscriptionProps = {
  expireDate: string
  nextPaymentDate: string
  isAutoRenewal: boolean
  onToggleAutoRenewal?: (checked: boolean) => void
}

export const CurrentSubscription = ({
  expireDate,
  nextPaymentDate,
  isAutoRenewal,
  onToggleAutoRenewal
}: CurrentSubscriptionProps) => {
  return (
    <div className={s.wrapper}>
      <Typography variant="h2" className={s.heading}>
        Current Subscription:
      </Typography>

      {/* Карточка с бордером (только даты) */}

      <div className={s.infobox}>
        <div className={s.column}>
          <span className={s.label}>Expire at</span>
          <span className={s.date}>{expireDate}</span>
        </div>

        <div className={s.column}>
          <span className={s.label}>Next payment</span>
          <span className={s.date}>{nextPaymentDate}</span>
        </div>
      </div>

      <div className={s.renewal}>
        <Checkbox checked={isAutoRenewal} onCheckedChange={onToggleAutoRenewal} />
        <span className={s.renewalText}>Auto-Renewal</span>
      </div>
    </div>
  )
}
