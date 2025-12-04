'use client'
import s from './homePostsList.module.css'
import { Post } from '@/entities/post/api/types'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { clsx } from 'clsx'
import { Button, Typography } from '@/shared/ui'
import { getTimeDifference } from '@/shared/lib/getTimeDifference'
import { Avatar } from '@/shared/ui/Avatar'

type Props = {
  post: Post
}

const SHORT_DESCRIPTION_LENGTH = 66

export const HomePostsList = ({ post }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const description = post?.description || ''
  const descriptionLength = description.trim().length

  const shouldShowButton = descriptionLength > SHORT_DESCRIPTION_LENGTH

  const getDisplayedText = () => {
    // Если текст короткий, показываем полностью
    if (!shouldShowButton) {
      return description
    }

    // Если текст развернут, показываем полностью
    if (isExpanded) {
      return description
    }

    // Если текст свернут, показываем только первые 66 символов
    return description.slice(0, SHORT_DESCRIPTION_LENGTH) + '...'
  }

  const handleToggleDescription = () => {
    setIsExpanded((prev) => !prev)
  }

  const firstImage = post.images && post.images.length > 0 ? post.images[0] : null

  return (
    <li className={s.postItem}>
      <div className={clsx(s.postImageWraper, isExpanded && s.postImageWraperExpanded)}>
        <Link href={`/profile/${post.ownerId}/post/${post.id}`} prefetch={false}>
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={post.description || 'Post image'}
              width={firstImage.width || 234}
              height={firstImage.height || 240}
              className={s.postImage}
              loading="lazy"
            />
          ) : (
            <div className={s.postImagePlaceholder}>No image</div>
          )}
        </Link>
      </div>

      <div className={s.userInfo}>
        <Avatar src={post.avatarOwner} alt="Avatar Image" size="small" />
        <Link className={s.userName} href={`/profile/${post.ownerId}`} prefetch={true}>
          <span className={s.userName}>{post.userName}</span>
        </Link>
      </div>

      <span className={s.time}>{getTimeDifference(post.createdAt)}</span>

      <Typography variant="regular_14" className={s.description}>
        <span className={s.descriptionText}>{getDisplayedText()}</span>
        {shouldShowButton && (
          <Button variant={'textButton'} className={s.showMoreButton} onClick={handleToggleDescription}>
            {isExpanded ? 'Hide' : 'Show more'}
          </Button>
        )}
      </Typography>
    </li>
  )
}
