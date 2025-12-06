'use client'

import { useId, useRef, useState, useEffect, useCallback } from 'react'
import { Dialog } from '@/shared/ui/temp/dialog/Dialog'
import { Button, SvgImage, Typography } from '@/shared/ui'
import { CroppingStep } from './CroppingStep'
import { useCreatePostImage } from '../api/useCreatePostImage'
import s from './CreatePostDialog.module.css'

type Step = 'select' | 'crop' | 'preview'

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

  const { mutate: uploadImages, isPending: isUploading } = useCreatePostImage()

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newImages: ImageItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      croppedBlob: null,
      croppedUrl: null
    }))

    setImages((prev) => [...prev, ...newImages])
    setCurrentImageIndex(images.length) // первый новый
    setStep('crop')

    if (onFileSelect && files[0]) onFileSelect(files[0])
    e.target.value = ''
  }

  const handleCropNext = useCallback(
    (blob: Blob) => {
      const croppedUrl = URL.createObjectURL(blob)
      setImages((prev) => {
        const updated = prev.map((img, idx) =>
          idx === currentImageIndex ? { ...img, croppedBlob: blob, croppedUrl } : img
        )

        const nextUncroppedIndex = updated.findIndex((img, idx) => idx > currentImageIndex && !img.croppedBlob)
        if (nextUncroppedIndex !== -1) setCurrentImageIndex(nextUncroppedIndex)
        else setStep('preview')

        return updated
      })
    },
    [currentImageIndex]
  )

  const handlePrevImage = () => setCurrentImageIndex((i) => Math.max(0, i - 1))
  const handleNextImage = () => setCurrentImageIndex((i) => Math.min(images.length - 1, i + 1))
  const handleDeleteImage = () => {
    const img = images[currentImageIndex]
    URL.revokeObjectURL(img.originalUrl)
    if (img.croppedUrl) URL.revokeObjectURL(img.croppedUrl)
    const newImages = images.filter((_, idx) => idx !== currentImageIndex)
    setImages(newImages)
    if (newImages.length === 0) setStep('select')
    setCurrentImageIndex((i) => Math.min(i, newImages.length - 1))
  }

  const handleUpload = () => {
    const files = images
      .map((img, idx) =>
        img.croppedBlob ? new File([img.croppedBlob], `cropped-${idx}.jpg`, { type: 'image/jpeg' }) : null
      )
      .filter((f): f is File => f !== null)
    if (files.length === 0) return

    uploadImages(
      { files },
      {
        onSuccess: () => onOpenChange(false),
        onError: (err) => console.error(err)
      }
    )
  }

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
            </div>
          </>
        )
      case 'crop':
        return currentImage ? (
          <CroppingStep
            imageUrl={currentImage.originalUrl}
            onBack={() => setStep('select')}
            onNext={handleCropNext}
            onPrevImage={handlePrevImage}
            onNextImage={handleNextImage}
            onDeleteImage={handleDeleteImage}
            canPrev={currentImageIndex > 0}
            canNext={currentImageIndex < images.length - 1}
            index={currentImageIndex}
            total={images.length}
          />
        ) : null
      case 'preview':
        return (
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h1">Preview</Typography>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', margin: '20px 0' }}>
              {images.map((img, idx) => (
                <img
                  key={img.id}
                  src={img.croppedUrl || img.originalUrl}
                  style={{ width: 200, height: 200, objectFit: 'cover' }}
                />
              ))}
            </div>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        )
    }
  }

  return (
    <Dialog
      className={s.modal}
      open={open}
      onOpenChange={onOpenChange}
      title={step !== 'crop' ? (step === 'select' ? 'Add Photo' : 'Preview') : undefined}
      closeOutContent={step !== 'crop'}
    >
      <div className={s.container}>{renderContent()}</div>
    </Dialog>
  )
}
