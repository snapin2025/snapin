'use client'

import { useFeedPosts } from '@/entities/posts/model'
import { useAuth } from '@/shared/lib'
import { Spinner } from '@/shared/ui'
import { FeedPostCard } from './FeedPostCard'
import s from './feedPage.module.css'

export const FeedPageClient = () => {
  const { user } = useAuth()
  const { data, isLoading, isError } = useFeedPosts()

  if (isLoading) {
    return (
      <div className={s.state}>
        <Spinner size={'2rem'} />
      </div>
    )
  }

  if (isError) {
    return <div className={s.state}>Failed to load feed.</div>
  }

  const posts = data?.items ?? []

  if (posts.length === 0) {
    return <div className={s.state}>Feed is empty. Follow users to see posts here.</div>
  }

  return (
    <section className={s.container}>
      <ul className={s.list}>
        {posts.map((post) => (
          <li key={post.id} className={s.item}>
            <FeedPostCard
              post={post}
              currentUserId={user?.userId ?? null}
              isFollowing={post.ownerId !== user?.userId}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
