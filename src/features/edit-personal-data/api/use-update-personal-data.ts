// хук

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePersonalData } from '@/features/edit-personal-data/api/update-personal-data'

export const useUpdatePersonalData = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePersonalData,
    onSuccess: () => {
      // Инвалидируем кэш профиля, чтобы при следующем запросе данные были актуальные
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      // Если нужно, можно показать уведомление (но это UI-логика, не здесь)
    },
    onError: (error) => {
      console.error('Failed to update profile:', error)
    }
  })
}
