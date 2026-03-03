'use client'

import Link from 'next/link'
import type { SearchUser } from '@/entities/user'
import { ROUTES } from '@/shared/lib/routes'
import { Avatar, Input, Spinner, Typography } from '@/shared/ui'
import { useSearchPage } from '../model/useSearchPage'
import s from './searchPage.module.css'

export const SearchPage = () => {
  const {
    searchValue,
    users,
    showRecentRequests,
    observerTarget,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    error,
    handleSearchChange,
    handleClearSearch
  } = useSearchPage()

  return (
    <section className={s.page}>
      <Typography variant="large" className={s.title}>
        Search
      </Typography>

      <Input
        type="search"
        placeholder="Search"
        value={searchValue}
        onChange={(event) => handleSearchChange(event.target.value)}
        onClear={handleClearSearch}
      />

      {showRecentRequests ? (
        <>
          <Typography variant="h2" className={s.recentRequestsTitle}>
            Recent requests
          </Typography>
          <div className={s.emptyState}>
            <Typography variant="h3" color="disabled" className={s.emptyTitle}>
              Oops! This place looks empty!
            </Typography>
            <Typography variant="regular_16" color="disabled">
              No recent requests
            </Typography>
          </div>
        </>
      ) : (
        <div className={s.resultsWrapper}>
          {error && (
            <Typography variant="regular_14" color="error">
              Failed to load users. Please try again.
            </Typography>
          )}

          <ul className={s.resultsList}>
            {users.map((user: SearchUser) => {
              const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
              const avatarUrl = user.avatars[0]?.url

              return (
                <li key={user.id}>
                  <Link href={ROUTES.APP.USER_PROFILE(user.id)} className={s.userLink} prefetch>
                    <Avatar src={avatarUrl} alt={user.userName} size="medium" />
                    <div className={s.userInfo}>
                      <Typography variant="bold_16" className={s.userName}>
                        {user.userName}
                      </Typography>
                      {fullName && (
                        <Typography variant="regular_16" color="disabled" className={s.fullName}>
                          {fullName}
                        </Typography>
                      )}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>

          {(isLoading || isFetchingNextPage || isFetching) && (
            <div className={s.loader}>
              <Spinner />
            </div>
          )}

          {hasNextPage && <div ref={observerTarget} className={s.observerTarget} aria-hidden="true" />}
        </div>
      )}
    </section>
  )
}
