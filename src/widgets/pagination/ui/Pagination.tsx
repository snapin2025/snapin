// src/widgets/pagination/ui/Pagination.tsx
'use client'

import { Button } from '@/shared/ui'
import { Select } from '@/shared/ui'
import { clsx } from 'clsx'
import s from './Pagination.module.css'

export type PaginationProps = {
  /** Текущая страница (начиная с 1) */
  currentPage: number
  /** Общее количество страниц */
  totalPages: number
  /** Количество элементов на странице */
  itemsPerPage: number
  /** Варианты количества элементов на странице */
  itemsPerPageOptions?: number[]
  /** Callback при изменении страницы */
  onPageChange: (page: number) => void
  /** Callback при изменении количества элементов на странице */
  onItemsPerPageChange: (itemsPerPage: number) => void
  /** Класс для контейнера */
  className?: string
}

export const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  itemsPerPageOptions = [10, 20, 50, 100],
  onPageChange,
  onItemsPerPageChange,
  className
}: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Показываем все страницы, если их мало
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Логика для большого количества страниц
      if (currentPage <= 3) {
        // Начало списка
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Конец списка
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Середина списка
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  const selectOptions = itemsPerPageOptions.map((value) => ({
    value: String(value),
    label: String(value)
  }))

  if (totalPages === 0) {
    return null
  }

  return (
    <div className={clsx(s.container, className)}>
      <button className={s.navButton} onClick={handlePrevious} disabled={currentPage === 1} aria-label="Previous page">
        &lt;
      </button>

      <div className={s.pageNumbers}>
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className={s.ellipsis}>
                ...
              </span>
            )
          }

          return (
            <button
              key={page}
              className={clsx(s.pageButton, currentPage === page && s.active)}
              onClick={() => onPageChange(page)}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}
      </div>

      <button className={s.navButton} onClick={handleNext} disabled={currentPage === totalPages} aria-label="Next page">
        &gt;
      </button>

      <div className={s.itemsPerPage}>
        <span className={s.itemsPerPageText}>Show</span>
        <Select
          value={String(itemsPerPage)}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
          options={selectOptions}
          label=""
          placeholder=""
        />
        <span className={s.itemsPerPageText}>on page</span>
      </div>
    </div>
  )
}
