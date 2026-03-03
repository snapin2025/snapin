'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { emitAccessTokenChanged } from '@/shared/lib/auth/accessTokenEvents'

/**
 * Компонент для обработки OAuth токенов из URL
 * Сохраняет токен в localStorage и очищает URL
 *
 * @remarks
 * Не использует useSearchParams, чтобы избежать необходимости Suspense boundary
 * Работает напрямую с window.location для максимальной совместимости
 *
 * @example
 * // В корневом layout
 * <AuthProvider>
 *   <OAuthHandler />
 *   {children}
 * </AuthProvider>
 */
export const OAuthHandler = () => {
  const router = useRouter()

  useEffect(() => {
    // Проверяем наличие токена в URL
    const url = new URL(window.location.href)
    const accessToken = url.searchParams.get('accessToken')

    if (accessToken) {
      // Сохраняем токен
      localStorage.setItem('accessToken', accessToken)
      emitAccessTokenChanged(accessToken)

      // Очищаем URL от токена
      url.searchParams.delete('accessToken')
      const cleanUrl = url.pathname + url.search

      // Заменяем URL без перезагрузки страницы
      router.replace(cleanUrl)
    }
  }, [router])

  return null
}
