// запрос GET

import { api } from '@/shared/api'
import {
  CancelAutoRenewalRequest,
  CurrentSubscriptionResponse
} from '@/features/cancel-auto-renewal/api/types/subscription-types'

export const subscriptionApi = {
  // GET запрос — для отображения
  getCurrentSubscription: async (): Promise<CurrentSubscriptionResponse> => {
    const response = await api.get<CurrentSubscriptionResponse>('/subscriptions/current-payment-subscriptions')
    return response.data
  },

  // POST запрос — для отмены продления подписки
  cancelAutoRenewal: async (payload: CancelAutoRenewalRequest): Promise<void> => {
    await api.post('/subscriptions/canceled-auto-renewal', payload)
  }
}
