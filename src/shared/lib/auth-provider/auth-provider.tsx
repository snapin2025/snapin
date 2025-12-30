'use client'

import { User } from '@/entities/user'
import { createContext, ReactNode, useContext } from 'react'
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

/**
 * Провайдер аутентификации
 * Управляет состоянием текущего пользователя
 * Использует useMe для получения данных пользователя
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, isError } = useMe()

  return <Auth.Provider value={{ user: user || null, isLoading, isError }}>{children}</Auth.Provider>
}
