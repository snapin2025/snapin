'use client'

import React, { useState, useCallback } from 'react'
import { Button, Typography, Input } from '@/shared/ui'
import { ArrowLeft } from '@/shared/ui/icons/ArrowLeft'
import { useAuth } from '@/shared/lib'
import s from './PublicationStep.module.css'

type ImageItem = {
  id: string
  croppedUrl: string | null
  originalUrl: string
}

type Props = {
  images: ImageItem[]
  currentImageIndex: number
  onBack: () => void
  onPublish: (data: { description: string; location: string }) => void
  onPrevImage: () => void
  onNextImage: () => void
  isPublishing?: boolean
}

const MAX_DESCRIPTION_LENGTH = 500

export const PublicationStep: React.FC<Props> = ({
  images,
  currentImageIndex,
  onBack,
  onPublish,
  onPrevImage,
  onNextImage,
  isPublishing = false
}) => {
  const { user } = useAuth()
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])

  const currentImage = images[currentImageIndex]
  const canPrev = currentImageIndex > 0
  const canNext = currentImageIndex < images.length - 1

  // Обработчик изменения описания
  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value)
    }
  }, [])

  // Обработчик изменения локации с поиском
  const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocation(value)
    
    // Простая логика предложений (в реальном приложении здесь будет API запрос)
    if (value.length > 0) {
      // Моковые данные для примера
      const suggestions = ['New York', 'Washington Square Park', 'Los Angeles', 'San Francisco']
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(value.toLowerCase())
      )
      setLocationSuggestions(filtered.slice(0, 4))
    } else {
      setLocationSuggestions([])
    }
  }, [])

  // Выбор локации из предложений
  const handleSelectLocation = useCallback((selectedLocation: string) => {
    setLocation(selectedLocation)
    setLocationSuggestions([])
  }, [])

  // Публикация
  const handlePublish = useCallback(() => {
    onPublish({
      description: description.trim(),
      location: location.trim()
    })
  }, [description, location, onPublish])

  const remainingChars = MAX_DESCRIPTION_LENGTH - description.length

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <Button variant="textButton" onClick={onBack} aria-label="Back">
          <ArrowLeft />
        </Button>
        <Typography variant="h1">Publication</Typography>
        <Button 
          onClick={handlePublish} 
          variant="primary" 
          disabled={isPublishing || !currentImage}
          aria-label="Publish"
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </Button>
      </div>

      <div className={s.content}>
        {/* Левая часть - изображение с навигацией */}
        <div className={s.imageSection}>
          {currentImage && (
            <>
              <div className={s.imageContainer}>
                <img 
                  src={currentImage.croppedUrl || currentImage.originalUrl} 
                  alt={`Publication ${currentImageIndex + 1}`}
                  className={s.image}
                />
                
                {/* Кнопки навигации по изображениям */}
                {canPrev && (
                  <button
                    className={s.navButton}
                    style={{ left: 12 }}
                    onClick={onPrevImage}
                    aria-label="Previous image"
                    type="button"
                  >
                    <ArrowLeft />
                  </button>
                )}
                {canNext && (
                  <button
                    className={s.navButton}
                    style={{ right: 12 }}
                    onClick={onNextImage}
                    aria-label="Next image"
                    type="button"
                  >
                    <ArrowLeft style={{ transform: 'rotate(180deg)' }} />
                  </button>
                )}
              </div>

              {/* Индикаторы изображений */}
              {images.length > 1 && (
                <div className={s.indicators}>
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`${s.indicator} ${idx === currentImageIndex ? s.indicatorActive : ''}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Правая часть - форма */}
        <div className={s.formSection}>
          {/* Профиль пользователя */}
          <div className={s.profile}>
            <div className={s.avatar}>
              {user?.userName?.[0]?.toUpperCase() || 'U'}
            </div>
            <Typography variant="regular_14">{user?.userName || 'User'}</Typography>
          </div>

          {/* Описание публикации */}
          <div className={s.field}>
            <label htmlFor="description" className={s.label}>
              Add publication descriptions
            </label>
            <textarea
              id="description"
              className={s.textarea}
              placeholder="Text-area"
              value={description}
              onChange={handleDescriptionChange}
              rows={6}
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            <div className={s.charCount}>
              {remainingChars} / {MAX_DESCRIPTION_LENGTH}
            </div>
          </div>

          {/* Локация */}
          <div className={s.field}>
            <label htmlFor="location" className={s.label}>
              Add location
            </label>
            <div className={s.locationWrapper}>
              <Input
                id="location"
                type="text"
                placeholder="New York"
                value={location}
                onChange={handleLocationChange}
                className={s.locationInput}
              />
              <span className={s.locationIcon}>📍</span>
            </div>

            {/* Предложения локаций */}
            {locationSuggestions.length > 0 && (
              <div className={s.suggestions}>
                {locationSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    className={s.suggestionItem}
                    onClick={() => handleSelectLocation(suggestion)}
                    type="button"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

