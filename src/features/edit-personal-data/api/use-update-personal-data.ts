import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePersonalData } from '@/entities/user/api/user'

export const useUpdatePersonalData = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePersonalData,
    onSuccess: () => {
      // Инвалидируем кэш профиля, чтобы при следующем запросе данные были актуальные
      queryClient.invalidateQueries({ queryKey: ['personal-data'] })
    },
    onError: (error) => {
      console.error('Failed to update profile:', error)
    }
  })
}
