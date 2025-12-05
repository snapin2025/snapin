import { ResponsesPosts } from '@/entities/post/api/types'

import s from './homePage.module.css'
import { RegisteredUsers } from '@/widgets/registeredUsers/RegisteredUsers'
import { HomePostsList } from '@/widgets'
// SSG: Страница будет статически сгенерирована на этапе сборки
// ISR: Страница будет перегенерирована каждые 60 секунд при запросах
export const revalidate = 60

type TotalCountUsersResponse = {
  totalCount: number
}

export const HomePage = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://inctagram.work/api/v1'

  let postsData: ResponsesPosts = {
    totalCount: 0,
    pageSize: 0,
    items: [],
    totalUsers: 0
  }
  let totalCountUsers = 0

  try {
    // Делаем два запроса параллельно для SSG
    const [postsResponse, usersResponse] = await Promise.all([
      fetch(`${apiUrl}posts/all`, {
        next: { revalidate: 60 } // ISR: перегенерировать каждые 60 секунд
      }),
      fetch(`${apiUrl}public-user`, {
        next: { revalidate: 60 } // ISR: перегенерировать каждые 60 секунд
      })
    ])

    if (postsResponse.ok) {
      postsData = await postsResponse.json()
      console.log(postsData)
    } else {
      console.error(`Failed to fetch posts: ${postsResponse.status}`)
    }

    if (usersResponse.ok) {
      const usersData: TotalCountUsersResponse = await usersResponse.json()
      totalCountUsers = usersData.totalCount
    } else {
      console.error(`Failed to fetch users count: ${usersResponse.status}`)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    // В случае ошибки возвращаем пустые данные, страница все равно будет сгенерирована
  }

  // Ограничиваем количество постов на сервере (лучше для SSG)
  const limitedPosts = postsData.items.slice(0, 4)

  return (
    <div className={s.container}>
      <RegisteredUsers totalCount={totalCountUsers} />
      <ul className={s.userPostsList}>
        {limitedPosts?.map((post) => (
          <HomePostsList key={post.id} post={post} />
        ))}
      </ul>
    </div>
  )
}
