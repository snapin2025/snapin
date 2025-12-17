'use client'

import { useState, useRef, useCallback } from 'react'
import { Button, Typography } from '@/shared/ui'
import { ArrowLeft } from '@/shared/ui/icons/ArrowLeft'
import s from './PreviewPhotoStep.module.css'

type Props = {
  imageUrl: string
  onBack: () => void
  onSave: (file: File) => void
  originalFile: File
}

export const PreviewPhotoStep = ({ imageUrl, onBack, onSave, originalFile }: Props) => {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      // Здесь можно добавить кроп, если нужно
      // Пока просто сохраняем оригинальный файл
      await onSave(originalFile)
    } finally {
      setIsSaving(false)
    }
  }, [originalFile, onSave])

  return (
    <div className={s.container}>
      <div className={s.preview}>
        <img src={imageUrl} alt="Profile preview" className={s.image} />
      </div>

      <div className={s.footer}>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
