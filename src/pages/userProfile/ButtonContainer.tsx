'use client'

import { useCallback } from 'react'
import { redirect } from 'next/navigation'
import s from './userProfile.module.css'

import { Button } from '@/shared/ui'
import { useAuth } from '@/shared/lib'
import { ROUTES } from '@/shared/lib/routes'

export type profileOwner = 'myProfile' | 'friendProfile' | 'guestProfile'

type Props = {
  profileOwner: profileOwner
}

/**
 * Контейнер кнопок действий профиля.
 * Здесь же лежат обработчики переходов/подписок.
 */
export const ButtonContainer = ({ profileOwner }: Props) => {
  const { user } = useAuth()
  const userId = user?.userId

  const goToSettings = useCallback(() => {
    if (!userId) return
    redirect(ROUTES.APP.DASHBOARD)
  }, [userId])

  return (
    <div className={s.buttonWrapper}>
      {profileOwner === 'myProfile' ? (
        <Button variant="secondary" onClick={goToSettings}>
          Profile settings
        </Button>
      ) : profileOwner === 'friendProfile' ? (
        <>
          <Button variant="outlined">Unfollow</Button>
          <Button variant="secondary">Send message</Button>
        </>
      ) : (
        <>
          <Button variant="primary">Follow</Button>
          <Button variant="secondary">Send message</Button>
        </>
      )}
    </div>
  )
}
