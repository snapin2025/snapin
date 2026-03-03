// счетчик для  лайками

import s from './PostLikes.module.css'
import { Avatar } from '@/shared/ui'

type PostLikesProps = {
  likesCount: number
  avatars?: string[]
}

export const PostLikes = ({ likesCount, avatars = [] }: PostLikesProps) => {
  const safeLikesCount = Number.isFinite(likesCount) ? likesCount : 0
  const likesLabel = `${safeLikesCount.toLocaleString('ru-RU')} Like${safeLikesCount === 1 ? '' : 's'}`

  return (
    <div className={s.likesBlock}>
      {avatars.length > 0 && (
        <div className={s.avatars}>
          {avatars.slice(0, 3).map((src, i) => (
            <Avatar key={i} src={src} size="very_small" alt={`avatar-${i}`} />
          ))}
        </div>
      )}
      <span className={s.count}>{likesLabel}</span>
    </div>
  )
}
