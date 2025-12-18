'use client'

import * as React from 'react'
import { Avatar, Button } from '@/shared/ui'
import { CloseOutline } from '@/shared/ui/icons/CloseOutline'
import s from './AvatarFofSettings.module.css'
import { useDeleteAvatar } from '@/features/user-profile/addAndDeleteAvatarPhoto/api/useDeleteAvatar'

type Props = {
  src: string | undefined
}
export const AvatarFofSettings = ({ src }: Props) => {
  const { mutateAsync: deleteAvatar, isPending: isDeletingAvatar } = useDeleteAvatar()

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar()
      // Кэш профиля автоматически обновится благодаря invalidateQueries в хуке
    } catch (e) {
      // TODO: здесь можно показать тост/уведомление об ошибке
      console.error('Failed to delete avatar', e)
    }
  }

  // Используем key на основе src для принудительного перерендера при изменении
  // Это помогает обойти кэш Next.js Image
  const avatarKey = React.useMemo(() => {
    return src || 'fallback'
  }, [src])

  return (
    <>
      <div className={s.avatar}>
        <Avatar key={avatarKey} alt="Avatar Fof" size="large" src={src} />
      </div>
      <Button className={s.button} variant="textButton" onClick={handleDeleteAvatar} disabled={isDeletingAvatar}>
        <div className={s.ring}>
          <CloseOutline />
        </div>
      </Button>
    </>
  )
}
