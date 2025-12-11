'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import s from './userProfile.module.css'

import { ButtonContainer, profileOwner } from './ButtonContainer'
import { PostImageSlider } from '@/shared/lib/post-image-slider'
import { useAuth } from '@/shared/lib'
import { useQuery } from '@tanstack/react-query'
import { postsApi } from '@/entities/posts/api/posts'
import { Post, ResponsesPosts } from '@/entities/posts/api/types'
import { Avatar, Spinner, Typography } from '@/shared/ui'

type Props = {
  userId: number
  profileOwner: profileOwner
  /**
   * Опциональное описание профиля (например, из настроек).
   */
  bio?: string
  /**
   * Отображаемое имя (если нужно перекрыть userName из useAuth).
   */
  displayName?: string
  /**
   * Кастомный аватар, если приходит вместе с профилем.
   */
  avatarUrl?: string
}

export const UserProfile = ({ userId, profileOwner, bio, displayName, avatarUrl }: Props) => {
  const { user } = useAuth()
  const name = displayName || user?.userName || 'User'

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<ResponsesPosts>({
    queryKey: ['user-posts', userId],
    queryFn: () => postsApi.getUserPosts(userId),

    staleTime: 60_000
  })

  const stats = useMemo(
    () => ({
      following: 0, // нет явного эндпоинта — выводим placeholder до появления API
      followers: 0,
      publications: data?.totalCount
    }),
    [data?.items]
  )

  const profileDescription =
    bio ??
    'Расскажите о себе в настройках профиля. Это поле можно обновить в разделе Profile settings — пользователи увидят его здесь.'

  return (
    <section className={s.page}>
      <div className={s.header}>
        <Avatar src={avatarUrl} alt={`${name} avatar`} size="large" />

        <div className={s.summary}>
          <div className={s.titleRow}>
            <span className={s.userName}>{name}</span>
            <div className={s.actions}>
              <ButtonContainer profileOwner={profileOwner} />
            </div>
          </div>

          <div className={s.stats}>
            <div className={s.statCard}>
              <span className={s.statValue}>{stats.following.toLocaleString('ru-RU')}</span>
              <span className={s.statLabel}>Following</span>
            </div>
            <div className={s.statCard}>
              <span className={s.statValue}>{stats.followers.toLocaleString('ru-RU')}</span>
              <span className={s.statLabel}>Followers</span>
            </div>
            <div className={s.statCard}>
              <span className={s.statValue}>{stats.publications}</span>
              <span className={s.statLabel}>Publications</span>
            </div>
          </div>

          <Typography variant="regular_14" className={s.bio}>
            {profileDescription}{' '}
            <Link href="#" prefetch={false}>
              Подробнее
            </Link>
          </Typography>
        </div>
      </div>

      <div className={s.postsSection}>
        <div className={s.titleRow} style={{ gap: 8 }}>
          {isFetching && !isLoading && <Spinner inline size={16} />}
        </div>

        {isError && (
          <div className={s.error}>
            Не удалось загрузить посты: {(error as Error)?.message || 'попробуйте позже'}
            <br />
            <button onClick={() => refetch()}>Повторить</button>
          </div>
        )}

        {isLoading ? (
          <div className={s.loader}>
            <Spinner />
          </div>
        ) : data?.items.length ? (
          <div className={s.grid}>
            {data.items.map((post) => (
              <div key={post.id} className={s.postCard}>
                <div className={s.postContent}>
                  <PostImageSlider
                    images={post.images}
                    postId={post.id}
                    ownerId={post.ownerId}
                    description={post.description}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={s.emptyState}>У пользователя пока нет публикаций</div>
        )}
      </div>
    </section>
  )
}
