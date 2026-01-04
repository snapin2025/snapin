import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subscriptionApi } from '@/features/cancel-auto-renewal'

/**
 * Хук для получения текущей подписки
 * Возвращает данные для компонента CurrentSubscription
 */

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ['current-subscription'],
    queryFn: subscriptionApi.getCurrentSubscription
  })
}

// для отмены автообновления
export const useCancelAutoRenewal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: subscriptionApi.cancelAutoRenewal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current-subscription']
      })
    },
    // Добавила обработку ошибку для истечение подписки ошибка 409 из свагера
    onError: (error) => {
      console.error('Ошибка отмены автообновления:', error)
    }
  })
}
