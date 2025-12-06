'use client'

import { useId, useRef, useState, useEffect, useCallback } from 'react'
import { Dialog } from '@/shared/ui/temp/dialog/Dialog'
import { Button, SvgImage, Typography } from '@/shared/ui'
import { CroppingStep } from './CroppingStep'
import { PublicationStep } from './PublicationStep'
import { useCreatePostImage } from '../api/useCreatePostImage'
import { useCreatePost } from '../api/useCreatePost'
import { validateFiles, MAX_FILE_COUNT } from '../model/fileValidation'
import s from './CreatePostDialog.module.css'

type Step = 'select' | 'crop' | 'publication'

type ImageItem = {
  id: string
  originalFile: File
  originalUrl: string
  croppedBlob: Blob | null
  croppedUrl: string | null
}

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onFileSelect?: (file: File) => void
}

export const CreatePostDialog = ({ open, onOpenChange, onFileSelect }: Props) => {
  const [step, setStep] = useState<Step>('select')
  const [images, setImages] = useState<ImageItem[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputId = useId()

  const { mutate: uploadImages, isPending: isUploadingImages } = useCreatePostImage()
  const { mutate: createPost, isPending: isCreatingPost } = useCreatePost()

  const isPublishing = isUploadingImages || isCreatingPost

  useEffect(() => {
    if (!open) {
      images.forEach((img) => {
        URL.revokeObjectURL(img.originalUrl)
        if (img.croppedUrl) URL.revokeObjectURL(img.croppedUrl)
      })
      setImages([])
      setStep('select')
      setCurrentImageIndex(0)
    }
  }, [open])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return

      // Получаем текущее состояние для валидации
      setImages((prevImages) => {
        // Валидация файлов
        const validation = validateFiles([...prevImages.map((img) => img.originalFile), ...files])
        if (!validation.valid) {
          console.error('File validation errors:', validation.errors)
          // TODO: Показать ошибки пользователю
          e.target.value = ''
          return prevImages
        }

        // Ограничиваем количество до MAX_FILE_COUNT
        const remainingSlots = MAX_FILE_COUNT - prevImages.length
        const filesToAdd = files.slice(0, remainingSlots)

        if (filesToAdd.length === 0) {
          console.warn(`Maximum ${MAX_FILE_COUNT} files allowed`)
          // TODO: Показать сообщение пользователю
          e.target.value = ''
          return prevImages
        }

        const newImages: ImageItem[] = filesToAdd.map((file) => ({
          id: `${Date.now()}-${Math.random()}`,
          originalFile: file,
          originalUrl: URL.createObjectURL(file),
          croppedBlob: null,
          croppedUrl: null
        }))

        const updatedImages = [...prevImages, ...newImages]
        const firstNewIndex = prevImages.length

        // Обновляем индекс и шаг синхронно
        // React батчит обновления состояния, так что это безопасно
        setCurrentImageIndex(firstNewIndex)
        setStep((currentStep) => (currentStep === 'select' ? 'crop' : currentStep))

        if (onFileSelect && filesToAdd[0]) onFileSelect(filesToAdd[0])
        e.target.value = ''

        return updatedImages
      })
    },
    [onFileSelect]
  )

  const handleCropNext = useCallback(
    (blob: Blob) => {
      const croppedUrl = URL.createObjectURL(blob)
      setImages((prev) => {
        const updated = prev.map((img, idx) =>
          idx === currentImageIndex ? { ...img, croppedBlob: blob, croppedUrl } : img
        )

        const nextUncroppedIndex = updated.findIndex((img, idx) => idx > currentImageIndex && !img.croppedBlob)
        if (nextUncroppedIndex !== -1) setCurrentImageIndex(nextUncroppedIndex)
        else setStep('publication')

        return updated
      })
    },
    [currentImageIndex]
  )

  // Удаление изображения
  const handleDeleteImage = useCallback(() => {
    const img = images[currentImageIndex]
    if (!img) return

    URL.revokeObjectURL(img.originalUrl)
    if (img.croppedUrl) URL.revokeObjectURL(img.croppedUrl)

    const newImages = images.filter((_, idx) => idx !== currentImageIndex)
    setImages(newImages)

    if (newImages.length === 0) {
      setStep('select')
      setCurrentImageIndex(0)
    } else {
      // Переключаемся на предыдущее изображение или остаемся на том же индексе
      setCurrentImageIndex((i) => Math.min(i, newImages.length - 1))
    }
  }, [currentImageIndex, images])

  // Открытие файлового диалога для добавления фото
  const handleAddPhotos = useCallback(() => {
    inputRef.current?.click()
  }, [])

  // Навигация по изображениям в Publication
  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((i) => Math.max(0, i - 1))
  }, [])

  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((i) => Math.min(images.length - 1, i + 1))
  }, [images.length])

  // Публикация поста
  const handlePublish = useCallback(
    (data: { description: string; location: string }) => {
      const files = images
        .map((img, idx) =>
          img.croppedBlob ? new File([img.croppedBlob], `cropped-${idx}.jpg`, { type: 'image/jpeg' }) : null
        )
        .filter((f): f is File => f !== null)
      if (files.length === 0) return

      // Сначала загружаем изображения
      uploadImages(
        { files },
        {
          onSuccess: (response) => {
            // После успешной загрузки изображений создаем пост
            // response содержит объект с массивом images, каждый элемент имеет uploadId
            const childrenMetadata = response.images.map((item) => ({
              uploadId: item.uploadId
            }))

            createPost(
              {
                description: data.description,
                childrenMetadata
              },
              {
                onSuccess: () => {
                  onOpenChange(false)
                },
                onError: (err) => {
                  console.error('Error creating post:', err)
                }
              }
            )
          },
          onError: (err) => {
            console.error('Error uploading images:', err)
          }
        }
      )
    },
    [images, uploadImages, createPost, onOpenChange]
  )

  const currentImage = images[currentImageIndex]

  const renderContent = () => {
    switch (step) {
      case 'select':
        return (
          <>
            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept="image/*"
              multiple
              className={s.hiddenInput}
              onChange={handleFileChange}
            />
            <div className={s.placeholder}>
              <SvgImage width={48} height={48} />
            </div>
            <div className={s.containerBtn}>
              <Button onClick={() => inputRef.current?.click()}>Select from Computer</Button>
              <Button>Open Draft</Button>
            </div>
          </>
        )
      case 'crop':
        return currentImage ? (
          <CroppingStep
            imageUrl={currentImage.originalUrl}
            onBack={() => setStep('select')}
            onNext={handleCropNext}
            onDeleteImage={images.length > 1 ? handleDeleteImage : undefined}
            onAddPhotos={handleAddPhotos}
            index={currentImageIndex}
            total={images.length}
            allImages={images.map((img, idx) => ({
              id: img.id,
              url: img.originalUrl,
              isCurrent: idx === currentImageIndex
            }))}
            onSelectImage={(idx) => setCurrentImageIndex(idx)}
          />
        ) : null
      case 'publication':
        return (
          <PublicationStep
            images={images.map((img) => ({
              id: img.id,
              croppedUrl: img.croppedUrl,
              originalUrl: img.originalUrl
            }))}
            currentImageIndex={currentImageIndex}
            onBack={() => {
              // Возвращаемся к последнему необрезанному изображению или к crop
              const lastUncroppedIndex = images.findIndex((img) => !img.croppedBlob)
              if (lastUncroppedIndex !== -1) {
                setCurrentImageIndex(lastUncroppedIndex)
                setStep('crop')
              } else {
                setCurrentImageIndex(images.length - 1)
                setStep('crop')
              }
            }}
            onPublish={handlePublish}
            onPrevImage={handlePrevImage}
            onNextImage={handleNextImage}
            isPublishing={isPublishing}
          />
        )
    }
  }

  return (
    <Dialog
      className={s.modal}
      open={open}
      onOpenChange={onOpenChange}
      title={step === 'select' ? 'Add Photo' : undefined}
      closeOutContent={step === 'select' || step === 'publication'}
    >
      <div className={s.container}>{renderContent()}</div>
    </Dialog>
  )
}
