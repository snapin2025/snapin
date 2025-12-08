'use client'

import { Dialog } from '@/shared/ui/temp/dialog/Dialog'
import { Button, SvgImage } from '@/shared/ui'
import { CroppingStep } from './CroppingStep'
import { PublicationStep } from './PublicationStep'
import { usePostDialogState } from '../hooks/usePostDialogState'
import { useFileUpload } from '../hooks/useFileUpload'
import { useImageHandlers } from '../hooks/useImageHandlers'
import { usePostPublish } from '../hooks/usePostPublish'
import s from './CreatePostDialog.module.css'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onFileSelect?: (file: File) => void
}

export const CreatePostDialog = ({ open, onOpenChange, onFileSelect }: Props) => {
  // Управление состоянием
  const state = usePostDialogState(open)

  // Работа с файлами
  const fileUpload = useFileUpload({
    images: state.images,
    setImages: state.setImages,
    setCurrentImageIndex: state.setCurrentImageIndex,
    setStep: state.setStep,
    onFileSelect
  })

  // Обработчики изображений
  const imageHandlers = useImageHandlers({
    images: state.images,
    currentImageIndex: state.currentImageIndex,
    setImages: state.setImages,
    setCurrentImageIndex: state.setCurrentImageIndex,
    setStep: state.setStep
  })

  // Публикация
  const publish = usePostPublish({
    images: state.images,
    onOpenChange
  })

  const currentImage = state.images[state.currentImageIndex]

  const renderContent = () => {
    switch (state.step) {
      case 'select':
        return (
          <>
            <div className={s.placeholder}>
              <SvgImage width={48} height={48} />
            </div>
            <div className={s.containerBtn}>
              <Button onClick={fileUpload.handleAddPhotos}>Select from Computer</Button>
              <Button>Open Draft</Button>
            </div>
          </>
        )
      case 'crop':
        return currentImage ? (
          <CroppingStep
            imageUrl={currentImage.originalUrl}
            onBack={() => state.setStep('select')}
            onNext={imageHandlers.handleCropNext}
            onDeleteImage={imageHandlers.handleDeleteImage}
            onAddPhotos={fileUpload.handleAddPhotos}
            index={state.currentImageIndex}
            total={state.images.length}
            allImages={state.images.map((img, idx) => ({
              id: img.id,
              url: img.originalUrl,
              isCurrent: idx === state.currentImageIndex
            }))}
            onSelectImage={(idx) => state.setCurrentImageIndex(idx)}
          />
        ) : null
      case 'publication':
        return (
          <PublicationStep
            images={state.images.map((img) => ({
              id: img.id,
              croppedUrl: img.croppedUrl,
              originalUrl: img.originalUrl
            }))}
            currentImageIndex={state.currentImageIndex}
            onBack={() => {
              const lastUncroppedIndex = state.images.findIndex((img) => !img.croppedBlob)
              if (lastUncroppedIndex !== -1) {
                state.setCurrentImageIndex(lastUncroppedIndex)
                state.setStep('crop')
              } else {
                state.setCurrentImageIndex(state.images.length - 1)
                state.setStep('crop')
              }
            }}
            onPublish={publish.handlePublish}
            onPrevImage={imageHandlers.handlePrevImage}
            onNextImage={imageHandlers.handleNextImage}
            isPublishing={publish.isPublishing}
          />
        )
    }
  }

  return (
    <Dialog
      className={s.modal}
      open={open}
      onOpenChange={onOpenChange}
      title={state.step === 'select' ? 'Add Photo' : undefined}
      closeOutContent={state.step === 'select' || state.step === 'publication'}
    >
      <input
        ref={fileUpload.inputRef}
        id={fileUpload.inputId}
        type="file"
        accept="image/*"
        multiple
        className={s.hiddenInput}
        onChange={fileUpload.handleFileChange}
      />
      <div className={s.container}>{renderContent()}</div>
    </Dialog>
  )
}
