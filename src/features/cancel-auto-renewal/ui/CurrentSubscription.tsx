'use client'
import s from './CurrentSubscription.module.css'
import { Checkbox, Typography } from '@/shared/ui'
import { useCancelAutoRenewal, useCurrentSubscription } from '@/features/cancel-auto-renewal/api/use-auto-renewal'
import { formatSubscriptionDate } from '../lib/format-date'

export type CurrentSubscriptionProps = {
  expireDate?: string
  nextPaymentDate?: string
  isAutoRenewal?: boolean
  onToggleAutoRenewal?: (checked: boolean) => void
}

export const CurrentSubscription = ({
  expireDate,
  nextPaymentDate,
  isAutoRenewal,
  onToggleAutoRenewal
}: CurrentSubscriptionProps) => {
  // Получаем данные из хуков
  const { data: subscription } = useCurrentSubscription()
  const { mutate: cancelAutoRenewal } = useCancelAutoRenewal()

  const currentSub = subscription?.data?.[0]

  // Используем либо пропсы, либо данные из хуков
  const finalExpireDate = expireDate || formatSubscriptionDate(currentSub?.endDateOfSubscription || '')
  const finalNextPaymentDate = nextPaymentDate || formatSubscriptionDate(currentSub?.dateOfPayment || '')
  const finalIsAutoRenewal = isAutoRenewal ?? currentSub?.autoRenewal ?? false

  const handleToggle = (checked: boolean) => {
    // Если пришёл колбэк из пропсов - используем его
    if (onToggleAutoRenewal) {
      onToggleAutoRenewal(checked)
    }
    // Иначе используем нашу логику отмены
    else if (!checked && currentSub?.subscriptionId) {
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
