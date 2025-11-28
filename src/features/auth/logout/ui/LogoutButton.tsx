'use client'

import { Button } from '@/shared/ui/button/Button'
import { Logout } from '@/shared/ui/icons'

import s from './logoutButton.module.css'
import { Typography } from '@/shared/ui'
import { useLogout } from '../api/useLogout'

type Props = {
  variant?: 'icon' | 'text' | 'both'
  className?: string
}

export const LogoutButton = ({ variant = 'both', className }: Props) => {
  const { mutate: handleLogout, isPending } = useLogout()

  const onLogoutClick = () => {
    handleLogout()
  }

  //TODO: Не реализован функционал открытия модельного окна  c подтверждением при выходе из системы

  return (
    <Button onClick={onLogoutClick} disabled={isPending} variant={'textButton'} className={className}>
      <div className={s.center}>
        {(variant === 'icon' || variant === 'both') && <Logout width={24} height={24} />}
        {(variant === 'text' || variant === 'both') && (
          <Typography className={s.text} variant="medium_14" asChild>
            <span>Log Out</span>
          </Typography>
        )}
      </div>
    </Button>
  )
}
