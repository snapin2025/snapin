'use client'
import s from './CurrentSubscription.module.css'
import { Checkbox, Typography } from '@/shared/ui'
import { useCurrentSubscription } from '../api/use-current-subscription'
import { useCancelAutoRenewal } from '../api/use-cancel-auto-renewal'
import { useRenewAutoRenewal } from '../api/use-renew-auto-renewal' // ← добавить

export type CurrentSubscriptionProps = {
  expireDate?: string
  nextPaymentDate?: string
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
  onToggleAutoRenewal
}: CurrentSubscriptionProps) => {
  const { data: subscription } = useCurrentSubscription()
  const { mutate: cancelAutoRenewal } = useCancelAutoRenewal()
  const { mutate: renewAutoRenewal } = useRenewAutoRenewal() // ← добавить
  const currentSub = subscription?.data?.[0]

  const finalExpireDate = expireDate || formatSubscriptionDate(currentSub?.endDateOfSubscription || '')
  const finalNextPaymentDate = nextPaymentDate || formatSubscriptionDate(currentSub?.dateOfPayment || '')

  // Для dev-окружения: показываем true если есть подписка, false если нет
  const finalIsAutoRenewal = currentSub ? currentSub.autoRenewal || true : false

  const handleToggle = (checked: boolean) => {
    // проверка
    if (!currentSub?.subscriptionId) return

    if (onToggleAutoRenewal) {
      onToggleAutoRenewal(checked)
    } else if (currentSub?.subscriptionId) {
      // ВКЛЮЧИТЬ или ВЫКЛЮЧИТЬ автопродление
      if (checked) {
        renewAutoRenewal({ subscriptionId: currentSub.subscriptionId })
      } else {
        cancelAutoRenewal({ subscriptionId: currentSub.subscriptionId })
      }
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
