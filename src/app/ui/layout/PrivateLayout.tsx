'use client'

import { WithAuthGuard } from '@/shared/lib/hoc'
/**
 * Тут создаем layout для всего приложения, например сайдбар
 * сетку и т.д.
 * */
const Layout = () => {
  return <div></div>
}

export const PrivateLayout = WithAuthGuard(Layout)
