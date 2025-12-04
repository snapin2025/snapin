'use client'

import { useAuth } from '@/shared/lib'
import { Spinner } from '@/shared/ui'

import { HomePostsList } from '@/widgets/homePostsList'
import { Post } from '@/entities/post/api/types'
import s from './homePage.module.css'
import { RegisteredUsers } from '@/widgets/registeredUsers/RegisteredUsers'

type Props = {
  posts: Post[]
  totalCountUsers: number
}

export const HomePageContent = ({ posts, totalCountUsers }: Props) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <Spinner />
  }

  const isAuth = !!user

  // Если пользователь авторизован, показываем ленту постов
  if (isAuth) {
    return <div className={s.container}>привет! это главная страница</div>
  }

  // Если пользователь не авторизован, показываем посты и количество пользователей
  return (
    <div className={s.container}>
      <RegisteredUsers totalCount={totalCountUsers} />
      <ul className={s.userPostsList}>
        {posts?.map((post) => (
          <HomePostsList key={post.id} post={post} />
        ))}
      </ul>
    </div>
  )
}
