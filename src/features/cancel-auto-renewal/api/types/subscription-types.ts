// Тип для подписки из API
// Тип для получения ТЕКУЩЕЙ ПОДПИСКИ пользователя (эндпоинт: /subscriptions/current-payment-subscriptions)

export type CurrentSubscriptionResponse = {
  data: Array<{
    userId: number
    subscriptionId: string
    dateOfPayment: string
    endDateOfSubscription: string
    autoRenewal: boolean
  }>
  hasAutoRenewal: boolean
}

export type CancelAutoRenewalRequest = {
  subscriptionId: string
}

export type RenewAutoRenewalRequest = {
  subscriptionId: string
}
