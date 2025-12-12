'use client'

import { useMemo, useRef } from 'react'
import Link from 'next/link'
import s from './userProfile.module.css'

import { ButtonContainer, profileOwner } from './ButtonContainer'
import { PostImageSlider } from '@/shared/lib/post-image-slider'
import { Avatar, Typography, PostSkeleton } from '@/shared/ui'
import { UserProfileResponse } from '@/entities/user/api/user-types'
import { InfiniteData } from '@tanstack/react-query'
import { ResponsesPosts } from '@/entities/posts/api/types'
import { useInfiniteScroll } from '@/shared/lib'

type Props = {
  profileOwner: profileOwner
  bio?: string
  displayName?: string
  avatarUrl?: string
  profileData?: UserProfileResponse | null
  postsData?: InfiniteData<ResponsesPosts>
  isPostsLoading?: boolean
  isPostsFetching?: boolean
  isFetchingNextPage?: boolean
  isPostsError?: boolean
  postsError?: Error | null
  refetchPosts?: () => void
  fetchNextPage?: () => void
  hasNextPage?: boolean
}

export const UserProfile = ({
  profileOwner,
  bio,
  displayName,
  avatarUrl,
  profileData,
  postsData,
  isPostsLoading = false,
  isFetchingNextPage = false,
  isPostsError = false,
  postsError,
  refetchPosts,
  fetchNextPage,
  hasNextPage = false
}: Props) => {
  const name = displayName || 'User'
  const observerTarget = useRef<HTMLDivElement>(null)

  // Объединяем все страницы постов в один массив
  // Мемоизируем, чтобы избежать пересчета при каждом рендере
  const allPosts = useMemo(() => postsData?.pages.flatMap((page) => page.items) ?? [], [postsData?.pages])

  // Используем данные из profileData для статистики, если они доступны
  // Мемоизируем, чтобы избежать пересчета при каждом рендере
  const stats = useMemo(
    () => ({
      following: profileData?.followingCount ?? 0,
      followers: profileData?.followersCount ?? 0,
      publications: profileData?.publicationsCount ?? postsData?.pages[0]?.totalCount ?? 0
    }),
    [profileData?.followingCount, profileData?.followersCount, profileData?.publicationsCount, postsData?.pages]
  )

  // Обработка бесконечной прокрутки через Intersection Observer
  useInfiniteScroll({
    targetRef: observerTarget,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage: fetchNextPage ?? (() => {}),
    threshold: 0.1,
    rootMargin: '10px'
  })

  // Простые вычисления - React 19 оптимизирует их автоматически
  // Оставляем мемоизацию только для дорогих операций (allPosts) и объектов (stats)
  const profileDescription =
    bio ??
    profileData?.aboutMe ??
    'Расскажите о себе в настройках профиля. Это поле можно обновить в разделе Profile settings — пользователи увидят его здесь.'

  const finalAvatarUrl = avatarUrl || profileData?.avatars?.[0]?.url

  return (
    <section className={s.page}>
      <div className={s.header}>
        <Avatar src={finalAvatarUrl} alt={`${name} avatar`} size="large" />

        <div className={s.summary}>
          <div className={s.titleRow}>
            <span className={s.userName}>{name}</span>
            <div className={s.actions}>
              <ButtonContainer profileOwner={profileOwner} />
            </div>
          </div>

          <div className={s.stats}>
            <div className={s.statCard}>
              <span className={s.statValue}>{stats.following}</span>
              <span className={s.statLabel}>Following</span>
            </div>
            <div className={s.statCard}>
              <span className={s.statValue}>{stats.followers}</span>
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
       {isPostsError && (
          <div className={s.error}>
            Не удалось загрузить посты: {postsError?.message || 'попробуйте позже'}
            <br />
            {refetchPosts && (
              <button type="button" onClick={() => refetchPosts()}>
                Повторить
              </button>
            )}
          </div>
        )}

        {isPostsLoading ? (
          <div className={s.loader}>{/* <Spinner /> */}</div>
        ) : allPosts.length > 0 ? (
          <>
            <div className={s.grid}>
              {allPosts.map((post) => (
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
            {/* Элемент для отслеживания скролла и загрузки следующей страницы */}
            {hasNextPage && (
              <div ref={observerTarget} className={s.skeletonContainer} aria-label="Загрузка следующих постов">
                {isFetchingNextPage && (
                  <div className={s.grid}>
                    <PostSkeleton count={8} />
                  </div>
                )}
              </div>
            )}
            {/* Отступ внизу, когда все посты загружены */}
            {!hasNextPage && allPosts.length > 0 && <div className={s.bottomSpacer} />}
          </>
        ) : (
          <div className={s.emptyState}>У пользователя пока нет публикаций</div>
        )}
      </div>
    </section>
  )
}
