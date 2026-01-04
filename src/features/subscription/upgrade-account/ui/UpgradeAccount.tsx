'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Card,
  Typography,
  Checkbox,
  Radio,
  RadioGroup,
  PaymentButton,
  Button,
  Dialog,
  DialogContent
} from '@/shared/ui'
import { useSubscriptionCost } from '@/entities/subscription/model/useSubscriptionCost'
import { useCurrentSubscription } from '@/entities/subscription/model/useCurrentSubscription'
import { useCreateSubscription } from '../api/useCreateSubscription'
import { SubscriptionType, PaymentType } from '@/entities/subscription/api/types'
import { SETTINGS_PART } from '@/shared/lib/routes'
import s from './UpgradeAccount.module.css'

export type AccountType = 'PERSONAL' | 'BUSINESS'

export const UpgradeAccount = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [accountType, setAccountType] = useState<AccountType>('PERSONAL')
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null)
  const [agree, setAgree] = useState(false)
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | null>(null)

  // Handle payment callback from payment system
  useEffect(() => {
    const paymentStatus = searchParams?.get('payment')
    if (paymentStatus === 'success') {
      setSuccessOpen(true)
      // Clean URL
      router.replace(`/settings?part=${SETTINGS_PART.SUBSCRIPTIONS}`)
    } else if (paymentStatus === 'error' || paymentStatus === 'cancel') {
      setErrorOpen(true)
      // Clean URL
      router.replace(`/settings?part=${SETTINGS_PART.SUBSCRIPTIONS}`)
    }
  }, [searchParams, router])

  const { data: subscriptionCosts, isLoading: isLoadingCosts } = useSubscriptionCost()
  const { data: currentSubscription, isLoading: isLoadingCurrent } = useCurrentSubscription()
  const { mutate: createSubscription, isPending: isCreating } = useCreateSubscription()

  // Get first subscription as default
  const defaultSubscription = useMemo(() => {
    if (subscriptionCosts?.data && subscriptionCosts.data.length > 0) {
      return subscriptionCosts.data[0]
    }
    return null
  }, [subscriptionCosts])

  // Initialize selectedSubscriptionId with default if not set
  const currentSubscriptionId = useMemo(() => {
    if (selectedSubscriptionId) {
      return selectedSubscriptionId
    }
    if (defaultSubscription) {
      return `${defaultSubscription.amount}-${defaultSubscription.typeDescription}`
    }
    return null
  }, [selectedSubscriptionId, defaultSubscription])

  const selectedSubscription = useMemo(() => {
    if (currentSubscriptionId && subscriptionCosts?.data) {
      return subscriptionCosts.data.find((item) => {
        const key = `${item.amount}-${item.typeDescription}`
        return key === currentSubscriptionId
      })
    }
    return defaultSubscription
  }, [currentSubscriptionId, subscriptionCosts, defaultSubscription])

  const handlePaymentClick = (paymentType: PaymentType) => {
    if (!selectedSubscription) return
    setSelectedPaymentType(paymentType)
    setCreatePaymentOpen(true)
  }

  const handleConfirmPayment = () => {
    if (!selectedSubscription || !selectedPaymentType || !agree) return

    const baseUrl = `${window.location.origin}/settings?part=${SETTINGS_PART.SUBSCRIPTIONS}`

    createSubscription(
      {
        typeSubscription: selectedSubscription.typeDescription,
        paymentType: selectedPaymentType,
        amount: selectedSubscription.amount,
        baseUrl
      },
      {
        onSuccess: (response) => {
          setCreatePaymentOpen(false)
          setAgree(false)
          // Redirect to payment URL
          if (response?.url) {
            window.location.href = response.url
          } else {
            setSuccessOpen(true)
          }
        },
        onError: () => {
          setCreatePaymentOpen(false)
          setErrorOpen(true)
        }
      }
    )
  }

  const getSubscriptionLabel = (item: { amount: number; typeDescription: SubscriptionType }) => {
    if (item.typeDescription === 'MONTHLY') return 'month'
    if (item.typeDescription === 'DAY') return '1 Day'
    if (item.typeDescription === 'WEEKLY') return '7 Day'
    return 'month'
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    } catch {
      return dateString
    }
  }

  const hasCurrentSubscription = currentSubscription?.data && currentSubscription.data.length > 0
  const currentSub = hasCurrentSubscription ? currentSubscription.data[0] : null

  if (isLoadingCosts || isLoadingCurrent) {
    return <div>Loading...</div>
  }

  return (
    <div className={s.container}>
      {/* Account type selection */}
      <div className={s.section}>
        <Typography variant="h3" className={s.sectionTitle}>
          Account type:
        </Typography>
        <RadioGroup
          value={accountType}
          onValueChange={(v) => setAccountType(v as AccountType)}
          className={s.radioGroup}
        >
          <Radio value="PERSONAL" label="Personal" />
          <Radio value="BUSINESS" label="Business" />
        </RadioGroup>
      </div>

      {/* Current subscription - only show if exists */}
      {hasCurrentSubscription && currentSub && (
        <div className={s.section}>
          <Typography variant="h3" className={s.sectionTitle}>
            Current Subscription:
          </Typography>
          <Card className={s.subscriptionCard}>
            <div className={s.subscriptionInfo}>
              <div>
                <Typography variant="regular_14" color="light">
                  Expire at
                </Typography>
                <Typography variant="regular_16">{formatDate(currentSub.endDateOfSubscription)}</Typography>
              </div>
              <div>
                <Typography variant="regular_14" color="light">
                  Next payment
                </Typography>
                <Typography variant="regular_16">
                  {currentSub.autoRenewal ? formatDate(currentSub.endDateOfSubscription) : '-'}
                </Typography>
              </div>
            </div>
            <div className={s.autoRenewal}>
              <Checkbox label="Auto-Renewal" checked={currentSub.autoRenewal} disabled />
            </div>
          </Card>
        </div>
      )}

      {/* Subscription costs - only show if Business selected */}
      {accountType === 'BUSINESS' && (
        <div className={s.section}>
          <Typography variant="h3" className={s.sectionTitle}>
            {hasCurrentSubscription ? 'Change your subscription:' : 'Your subscription costs:'}
          </Typography>
          {subscriptionCosts?.data && subscriptionCosts.data.length > 0 ? (
            <RadioGroup
              value={currentSubscriptionId || ''}
              onValueChange={setSelectedSubscriptionId}
              className={s.radioGroup}
            >
              {subscriptionCosts.data.map((item) => {
                const key = `${item.amount}-${item.typeDescription}`
                const label = `$${item.amount} per ${getSubscriptionLabel(item)}`
                return <Radio key={key} value={key} label={label} />
              })}
            </RadioGroup>
          ) : (
            <Typography variant="regular_14" color="light">
              No subscription plans available
            </Typography>
          )}
        </div>
      )}

      {/* Payment buttons - only show if Business selected and subscription available */}
      {accountType === 'BUSINESS' &&
        subscriptionCosts?.data &&
        subscriptionCosts.data.length > 0 &&
        selectedSubscription && (
          <div className={s.paymentSection}>
            <PaymentButton
              variant="paypal"
              onClick={() => handlePaymentClick('PAYPAL')}
              disabled={isCreating || !selectedSubscription}
            >
              PayPal
            </PaymentButton>
            <Typography variant="regular_14" color="light" className={s.orText}>
              Or
            </Typography>
            <PaymentButton
              variant="stripe"
              onClick={() => handlePaymentClick('STRIPE')}
              disabled={isCreating || !selectedSubscription}
            >
              Stripe
            </PaymentButton>
          </div>
        )}

      {/* Create Payment Modal */}
      <Dialog open={createPaymentOpen} onOpenChange={setCreatePaymentOpen}>
        <DialogContent title="Create payment" showCloseButton>
          <Typography variant="regular_14" color="light" className={s.modalText}>
            Auto-renewal will be enabled with this payment. You can disable it anytime in your profile settings
          </Typography>
          <div className={s.agreeSection}>
            <Checkbox label="I agree" checked={agree} onCheckedChange={(checked) => setAgree(Boolean(checked))} />
            <Button variant="primary" onClick={handleConfirmPayment} disabled={!agree || isCreating}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent title="Success" showCloseButton>
          <Typography variant="regular_14" color="light" className={s.modalText}>
            Payment was successful!
          </Typography>
          <div className={s.modalFooter}>
            <Button variant="primary" onClick={() => setSuccessOpen(false)}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={errorOpen} onOpenChange={setErrorOpen}>
        <DialogContent title="Error" showCloseButton>
          <Typography variant="regular_14" color="light" className={s.modalText}>
            Transaction failed, please try again
          </Typography>
          <div className={s.modalFooter}>
            <Button variant="primary" onClick={() => setErrorOpen(false)}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
