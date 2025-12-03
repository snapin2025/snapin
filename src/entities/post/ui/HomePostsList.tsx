import s from './homePostsList.module.css'
import { Post } from '@/widgets/postList/api/types'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/shared/ui'
import { getTimeDifference } from '@/shared/lib/getTimeDifference'
import { Avatar } from '@/shared/ui/Avatar'

type Props = {
  post: Post
}

const countLetter = 82
const maxLetters = 210

export const HomePostsList = ({ post }: Props) => {
  const [text, setText] = useState('Show more')
  const postDescriptionLength =
    post && post.description && post.description.length > countLetter
      ? post.description.slice(0, countLetter) + '...'
      : post.description
  const [textDescription, setTextDescription] = useState(postDescriptionLength)

  const handleChangeHeightText = (value?: number) => {
    if (value) {
      setTimeout(() => {
        setTextDescription(post.description.slice(0, value) + '...')
      }, 390)
    } else {
      setTextDescription(post.description.slice(0, countLetter) + '...')
    }
  }

  const firstImage = post.images && post.images.length > 0 ? post.images[0] : null

  return (
    <li className={s.postItem}>
      <div className={s.postImageWraper}>
        <Link href={`/profile/${post.ownerId}/post/${post.id}`} prefetch={false}>
          {firstImage ? (
            <Image
              src={firstImage.url}
              alt={post.description || 'Post image'}
              width={firstImage.width || 234}
              height={firstImage.height || 234}
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

      <p className={s.description}>
        {textDescription}
        {textDescription.length > countLetter && (
          <Button
            variant={'textButton'}
            className={s.showMoreButton}
            onClick={() => {
              if (text === 'Show more') {
                handleChangeHeightText(maxLetters)
                setText('Show less')
              } else {
                handleChangeHeightText()
                setText('Show more')
              }
            }}
          >
            {text}
          </Button>
        )}
      </p>
    </li>
  )
}
