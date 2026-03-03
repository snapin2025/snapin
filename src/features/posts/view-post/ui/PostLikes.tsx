// счетчик для  лайками

import s from './PostLikes.module.css'
import { Avatar } from '@/shared/ui'

type PostLikesProps = {
  likesCount: number
  avatars?: string[] // массив аватарок
}

export const PostLikes = ({ likesCount, avatars = [] }: PostLikesProps) => {
  return (
    <div className={s.likesBlock}>
      {/* ✅ аватарки */}
      {avatars.length > 0 && (
        <div className={s.avatars}>
          {avatars.slice(0, 3).map((src, i) => (
            <Avatar key={i} src={src} size="small" alt={`avatar-${i}`} />
          ))}
        </div>
      )}

      {/*<LikeButton postId={postId} initialIsLiked={isLiked} />*/}
      <span className={s.count}>{`${likesCount} "Like"`}</span>
    </div>
  )
}
//  будим использовать в компоненте PostModalFooter.tsx
