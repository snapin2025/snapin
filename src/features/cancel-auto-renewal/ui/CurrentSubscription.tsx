'use client'
import s from './CurrentSubscription.module.css'
import { Checkbox, Typography } from '@/shared/ui'
import { useCurrentSubscription } from '../api/use-current-subscription'
import { useCancelAutoRenewal } from '../api/use-cancel-auto-renewal'

export type CurrentSubscriptionProps = {
  expireDate?: string
  nextPaymentDate?: string
  isAutoRenewal?: boolean
  onToggleAutoRenewal?: (checked: boolean) => void
}

// Форматирование прямо в компоненте
const formatSubscriptionDate = (isoString: string): string => {
  if (!isoString) return ''
  const date = new Date(isoString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export const UnsubscribeAutoRenewal = ({
  expireDate,
  nextPaymentDate,
  isAutoRenewal,
  onToggleAutoRenewal
}: CurrentSubscriptionProps) => {
  const { data: subscription } = useCurrentSubscription()
  const { mutate: cancelAutoRenewal } = useCancelAutoRenewal()

  const currentSub = subscription?.data?.[0]

  const finalExpireDate = expireDate || formatSubscriptionDate(currentSub?.endDateOfSubscription || '')
  const finalNextPaymentDate = nextPaymentDate || formatSubscriptionDate(currentSub?.dateOfPayment || '')
  const finalIsAutoRenewal = isAutoRenewal ?? currentSub?.autoRenewal ?? false

  const handleToggle = (checked: boolean) => {
    if (onToggleAutoRenewal) {
      onToggleAutoRenewal(checked)
    } else if (!checked && currentSub?.subscriptionId) {
      cancelAutoRenewal({ subscriptionId: currentSub.subscriptionId })
    }
  }

  return (
    <div className={s.wrapper}>
      <Typography variant="h2" className={s.heading}>
        Current Subscription:
      </Typography>

      <div className={s.infobox}>
        <div className={s.column}>
          <span className={s.label}>Expire at</span>
          <span className={s.date}>{finalExpireDate}</span>
        </div>

        <div className={s.column}>
          <span className={s.label}>Next payment</span>
          <span className={s.date}>{finalNextPaymentDate}</span>
        </div>
      </div>

      <div className={s.renewal}>
        <Checkbox checked={finalIsAutoRenewal} onCheckedChange={handleToggle} />
        <span className={s.renewalText}>Auto-Renewal</span>
      </div>
    </div>
  )
}
