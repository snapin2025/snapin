//я должна быть ssg
import { RegisteredUsers } from '@/widgets/registeredUsers/ui/registeredUsers'
import { PostList } from '@/widgets'
import { ResponsesPosts } from '@/widgets/postList/api/types'
import s from './homePage.module.css'

export const HomePage = async () => {
  let postsData: ResponsesPosts = {
    totalCount: 0,
    pageSize: 0,
    items: [],
    totalUsers: 0
  }

  try {
    const response = await fetch(`https://inctagram.work/api/v1/posts/all`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    postsData = await response.json()
  } catch (error) {
    console.error('Error fetching posts:', error)
  }

  return (
    <div className={s.container}>
      <RegisteredUsers />
      <PostList userPosts={postsData.items} />
    </div>
  )
}
