'use client'

import { useQuery } from '@tanstack/react-query'
import { userApi } from '../api/user'
import { PublicUserProfile, UserProfileResponse } from '../api/user-types'

/**
 * Хук для получения данных профиля пользователя по userName.
 * Используется на странице профиля для отображения статистики и информации.
 *
 * @param userName - Имя пользователя для загрузки профиля (может быть null/undefined)
 * @returns Результат запроса с данными профиля, состоянием загрузки и ошибками
 */
export const useUserProfile = (userName: string | null | undefined) => {
  return useQuery<UserProfileResponse, Error>({
    queryKey: ['user-profile', userName],
    queryFn: () => {
      // Дополнительная проверка для TypeScript (enabled уже проверяет, но это для безопасности)
      const result = userApi.userProfile(userName!)
      return result
    },
    enabled: !!userName && userName.trim().length > 0,
    staleTime: 0, // Всегда считаем данные устаревшими
    gcTime: 30_000, // 30 секунд в кэше (короткий период для актуальности)
    retry: 1,
    refetchOnMount: 'always', // ВСЕГДА рефетчим при монтировании
    refetchOnWindowFocus: true // Обновляем при возврате на вкладку
  })
}

/**
 * Хук для получения публичного профиля пользователя по ID.
 * Используется для получения базовой информации о пользователе.
 *
 * @param profileId - ID пользователя для загрузки профиля (может быть null/undefined)
 * @returns Результат запроса с данными публичного профиля, состоянием загрузки и ошибками
 */
export const usePublicUserProfile = (profileId: number | null | undefined) => {
  return useQuery<PublicUserProfile, Error>({
    queryKey: ['public-user-profile', profileId],
    queryFn: () => userApi.getPublicUserProfile(profileId!),
    enabled: !!profileId && profileId > 0,
    staleTime: 0, // Всегда считаем данные устаревшими
    gcTime: 30_000, // 30 секунд в кэше (короткий период для актуальности)
    retry: 1,
    refetchOnMount: 'always', // ВСЕГДА рефетчим при монтировании (не зависит от staleTime)
    refetchOnWindowFocus: true // Обновляем при возврате на вкладку
  })
}
