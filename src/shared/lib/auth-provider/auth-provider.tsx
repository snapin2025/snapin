'use client'

import { User } from '@/entities/user'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { useMe } from '@/shared/api'

type AuthContext = {
  user: User | null
  isLoading: boolean
  isError: boolean
}

const Auth = createContext<AuthContext | null>(null)
export const AuthContext = Auth

export const useAuth = () => {
  const ctx = useContext(Auth)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, isError } = useMe()

  // Мемоизируем значение контекста для предотвращения ненужных ре-рендеров
  // дочерних компонентов при обновлении провайдера
  const contextValue = useMemo(
    () => ({
      user: user || null,
      isLoading,
      isError
    }),
    [user, isLoading, isError]
  )

  return <Auth.Provider value={contextValue}>{children}</Auth.Provider>
}
