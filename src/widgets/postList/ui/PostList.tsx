'use client'

import s from './postList.module.css'
import { HomePostsList } from '@/entities/post/ui/HomePostsList'
import { Post } from '@/widgets/postList/api/types'

type Props = {
  userPosts: Post[]
}

export const PostList = ({ userPosts }: Props) => {
  return (
    <ul className={s.userPostsList}>
      {userPosts?.slice(0, 4).map((post) => (
        <HomePostsList key={post.id} post={post} />
      ))}
    </ul>
  )
}
