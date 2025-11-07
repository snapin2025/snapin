'use client'
import { useQuery } from '@tanstack/react-query'
import { TypedAuthApiClient } from '@/shared/api/client/api-typed-client'

const apiClient = new TypedAuthApiClient({ baseUrl: 'https://snapin.ru' })

export function MainPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: () => apiClient.getTyped('/api/v1/auth/me', 'GET')
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  return <div>{}</div>
}
