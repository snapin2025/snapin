import { RegisteredUsers } from '@/widgets/registeredUsers/ui/registeredUsers'
import { PostList } from '@/widgets'
import { ResponsesPosts } from '@/widgets/postList/api/types'
import s from './homePage.module.css'

// SSG: Страница будет статически сгенерирована на этапе сборки
// ISR: Страница будет перегенерирована каждые 60 секунд при запросах
export const revalidate = 60

export const HomePage = async () => {
  const apiUrl = 'https://inctagram.work/api/v1'
  let postsData: ResponsesPosts = {
    totalCount: 0,
    pageSize: 0,
    items: [],
    totalUsers: 0
  }

  try {
    // Для SSG используем cache: 'force-cache' (по умолчанию) или не указываем cache
    // Это позволит Next.js кешировать данные на этапе сборки
    const response = await fetch(`${apiUrl}/posts/all`, {
      next: { revalidate: 60 } // ISR: перегенерировать каждые 60 секунд
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    postsData = await response.json()
  } catch (error) {
    console.error('Error fetching posts:', error)
    // В случае ошибки возвращаем пустые данные, страница все равно будет сгенерирована
  }

  return (
    <div className={s.container}>
      <RegisteredUsers />
      <PostList userPosts={postsData.items} />
    </div>
  )
}
