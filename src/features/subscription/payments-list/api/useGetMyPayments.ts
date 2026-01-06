'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { subscriptionApi } from '@/entities/subscription/api/subscription'
import { subscriptionKeys } from '@/entities/subscription/model/keys'

export const useGetMyPayments = () => {
  return useQuery({
    queryKey: subscriptionKeys.payments(),
    queryFn: () => subscriptionApi.getMyPayments()
  })
}
