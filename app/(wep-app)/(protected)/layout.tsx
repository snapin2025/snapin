'use client'
import { ReactNode } from 'react'
import { WithAuthGuard } from '@/shared/lib'
import { NotificationsSocket } from '@/entities/notification'

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <NotificationsSocket />
      {children}
    </div>
  )
}

export default WithAuthGuard(ProtectedLayout)
