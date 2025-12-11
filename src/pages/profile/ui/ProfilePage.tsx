'use client'

import { useParams } from 'next/navigation'
import { Spinner } from '@/shared/ui'
import { useAuth } from '@/shared/lib'
import { UserProfile } from '@/pages/profile/ui/userProfile'
import type { profileOwner } from '@/pages/profile/ui/userProfile/ButtonContainer'

export function ProfilePage() {
  const params = useParams<{ id?: string }>()
  const userId = Number(params?.id)

  const { user, isLoading } = useAuth()

  if (!userId || Number.isNaN(userId)) {
    return <div>Профиль не найден</div>
  }

  const owner: profileOwner = user?.userId === userId ? 'myProfile' : 'guestProfile'

  if (isLoading) {
    return <Spinner />
  }

  return <UserProfile userId={userId} profileOwner={owner} displayName={user?.userName} />
}
