'use client'

import Image from 'next/image'
import s from './PostCard.module.css'
import { Card } from '@/shared/ui'
import DropMenu from '@/shared/ui/dropdown/DropMenu'

type PostCardProps = {
  userName: string
  avatar: string
  description?: string
  timeAgo?: string
  showDropMenu?: boolean
  showActions?: boolean
}

export function PostCard({
  userName,
  avatar,
  description,
  timeAgo,
  showDropMenu = true,
  showActions = false
}: PostCardProps) {
  const shouldShowMenu = showDropMenu && !description

  return (
    <Card className={s.postCard}>
      {/* Вся карточка */}
      <div className={s.card}>
        <Image src="/girl.png" alt={`${userName}'s Avatar`} width={36} height={36} className={s.avatar} />

        <div className={s.content}>
          {/* Если есть описание - используем textBlock как в примере */}
          {description ? (
            <div className={s.textBlock}>
              <span className={s.userName}>{userName}</span> {description}
            </div>
          ) : (
            /* Если нет описания - используем top для имени и меню */
            <div className={s.top}>
              <span className={s.userName}>{userName}</span>
              {shouldShowMenu && <DropMenu />}
            </div>
          )}

          {/* Время и Answer внизу */}
          {(timeAgo || showActions) && (
            <div className={s.bottom}>
              {timeAgo && <span className={s.timeAgo}>{timeAgo}</span>}
              {showActions && <span className={s.answer}>Answer</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
