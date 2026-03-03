'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchUsers } from '@/entities/user'
import type { SearchUser } from '@/entities/user'
import { useInfiniteScroll } from '@/shared/lib'

const DEBOUNCE_MS = 400

export const useSearchPage = () => {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchValue.trim())
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [searchValue])

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useSearchUsers({
    search: debouncedSearch
  })

  const users = useMemo(
    () => data?.pages.flatMap((page) => (Array.isArray(page.items) ? page.items : [])) ?? [],
    [data]
  ) as SearchUser[]

  const showRecentRequests = debouncedSearch.length === 0

  useInfiniteScroll({
    targetRef: observerTarget,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage: async () => {
      await fetchNextPage()
    },
    threshold: 0.15,
    rootMargin: '40px',
    enabled: !showRecentRequests
  })

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const handleClearSearch = () => {
    setSearchValue('')
    setDebouncedSearch('')
  }

  return {
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
  }
}
