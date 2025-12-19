import { AxiosError } from 'axios'

import { useSuspenseQuery } from '@tanstack/react-query'
import { PersonalData, userApi } from '@/entities/user'

export const usePersonalData = () => {
  return useSuspenseQuery<PersonalData, AxiosError<{ statusCode: number }>>({
    queryKey: ['personal-data'],
    queryFn: userApi.getPersonalData
  })
}
