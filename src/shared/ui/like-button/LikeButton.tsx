// кнопка для лайка
import { Button } from '@/shared/ui'
import { HeartRed } from '@/shared/ui/icons'
import s from './LikeButton.module.css'
import { useLikePost } from '@/features/posts/view-post/model'
import { useState } from 'react'
import { Heart } from '@/shared/ui/icons/Heart'

export type LikeButtonProps = {
  postId: number
  initialIsLiked?: boolean
  className?: string
}

export const LikeButton = ({ postId, initialIsLiked = false, className = '' }: LikeButtonProps) => {
  const { mutate } = useLikePost(postId)
  const [isLiked, setIsLiked] = useState(initialIsLiked)

  const handleClick = () => {
    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    mutate(newIsLiked ? 'LIKE' : 'NONE')
  }

  return (
    <Button asChild variant="textButton" onClick={handleClick} className={`${s.likeButton} ${className}`}>
      <button>{isLiked ? <HeartRed className={s.heartIcon} /> : <Heart className={s.heartIcon} />}</button>
    </Button>
  )
}
