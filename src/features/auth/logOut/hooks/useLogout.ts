import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { logout } from '@/features/auth/logOut/api'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Удаляем токен из localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
      }

      // Очищаем все кэшированные данные
      queryClient.clear()

      // Перенаправляем на страницу входа
      router.push('/auth/signin')
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Даже при ошибке очищаем локальные данные
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
      }
      queryClient.clear()
      router.push('/auth/signin')
    }
  })

  return mutation
}
