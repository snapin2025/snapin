'use client'

import { Button } from '@/shared/ui'
import { useAuth } from '@/shared/lib'
import { ROUTES } from '@/shared/lib/routes'
import { useToggleFollowUser } from '@/entities/user'
import Link from 'next/link'
import type { ProfileOwner } from '../api/useProfileData'
import s from './userProfile.module.css'

type Props = {
  profileOwner: ProfileOwner
  profileId: number
  profileUserName: string | null
  isFollowing: boolean
}

/**
 * Контейнер кнопок действий профиля.
 * Здесь же лежат обработчики переходов/подписок.
 */
export const ProfileActions = ({ profileOwner, profileId, profileUserName, isFollowing }: Props) => {
  const { user } = useAuth()
  const userId = user?.userId
  const { toggleFollow, isPending } = useToggleFollowUser(user?.userName)

  return (
    <div className={s.buttonWrapper}>
      {profileOwner === 'myProfile' ? (
        <Button asChild variant="secondary">
          <Link href={ROUTES.APP.SETTINGS.PART()}>Profile settings</Link>
        </Button>
      ) : profileOwner === 'friendProfile' ? (
        <>
          <Button
            variant={isFollowing ? 'outlined' : 'primary'}
            onClick={() =>
              toggleFollow({
                profileId,
                userName: profileUserName,
                isFollowing
              })
            }
            disabled={isPending}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
          <Button variant="secondary">Send message</Button>
        </>
      ) : (
        userId && (
          <>
            <Button variant="primary">Follow</Button>
            <Button variant="secondary">Send message</Button>
          </>
        )
      )}
    </div>
  )
}
