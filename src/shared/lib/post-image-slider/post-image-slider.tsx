'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { clsx } from 'clsx'
import { ArrowBack, ArrowForward, Dot } from '@/shared/ui/icons'
import { ImagePost } from '@/entities/post/api/types'
import s from './post-image-slider.module.css'
import { Button } from '@/shared/ui'

type Props = {
  images: ImagePost[]
  postId: number
  ownerId: number
  description?: string
}

/**
 * Кастомный слайдер изображений для постов
 *
 * Особенности реализации:
 * - Нативная навигация без внешних библиотек (меньше bundle size)
 * - Плавные CSS transitions для производительности
 * - Поддержка клавиатуры для accessibility
 * - Оптимизация рендеринга через useCallback
 * - Автоматическое скрытие кнопок на краях
 */
export const PostImageSlider = ({ images, postId, ownerId, description }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Мемоизация обработчиков для оптимизации ре-рендеров
  const handlePrevious = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    },
    [images.length]
  )

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    },
    [images.length]
  )

  const handleDotClick = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex(index)
  }, [])

  // Обработка клавиатуры для accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
      }
    },
    [images.length]
  )

  // Показываем кнопки только если больше одного изображения
  const showNavigation = images.length > 1

  return (
    <div className={s.sliderContainer} onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Контейнер изображений с overflow для скрытия неактивных */}
      <div className={s.imagesWrapper} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={image.uploadId || index} className={s.imageSlide}>
            <Link href={`/profile/${ownerId}/post/${postId}`} prefetch={false} className={s.imageLink}>
              <Image
                src={image.url}
                alt={description || `Post image ${index + 1}`}
                width={image.width || 234}
                height={image.height || 240}
                className={s.image}
                loading={index === 0 ? 'eager' : 'lazy'}
                // Приоритет для первого изображения для LCP оптимизации
                priority={index === 0}
              />
            </Link>
          </div>
        ))}
      </div>

      {/* Кнопки навигации */}
      {showNavigation && (
        <>
          <button
            type="button"
            className={clsx(s.navButton, s.navButtonLeft)}
            onClick={handlePrevious}
            aria-label="Previous image"
            aria-disabled={false}
          >
            <ArrowBack className={s.navIcon} />
          </button>

          <button
            type="button"
            className={clsx(s.navButton, s.navButtonRight)}
            onClick={handleNext}
            aria-label="Next image"
            aria-disabled={false}
          >
            <ArrowForward className={s.navIcon} />
          </button>
        </>
      )}

      {/* Индикаторы точек */}
      {showNavigation && (
        <div className={s.dotsContainer} role="tablist" aria-label="Image navigation">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={clsx(s.dotButton, index === currentIndex && s.dotButtonActive)}
              onClick={(e) => handleDotClick(index, e)}
              aria-label={`Go to image ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
            >
              <Dot className={s.dotIcon} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
