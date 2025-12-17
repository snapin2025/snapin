'use client'

import * as React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent } from '@/shared/ui/modal'
import { useProfilePhotoUpload } from '../hooks/useProfilePhotoUpload'
import { SelectPhotoStep } from './SelectPhotoStep'
import { PreviewPhotoStep } from './PreviewPhotoStep'
import { ProfilePhotoValidationModal } from './ProfilePhotoValidationModal'
import s from './AddProfilePhoto.module.css'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (file: File) => Promise<void>
}

type Step = 'select' | 'preview'

export const AddProfilePhoto = ({ open, onOpenChange, onSave }: Props) => {
  const [step, setStep] = useState<Step>('select')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showValidationModal, setShowValidationModal] = useState(false)

  const handleClose = () => {
    onOpenChange(false)
    // Сброс состояния при закрытии
    setTimeout(() => {
      setStep('select')
      setSelectedFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    }, 300)
  }

  const fileUpload = useProfilePhotoUpload({
    onFileSelect: (file, url) => {
      setSelectedFile(file)
      setPreviewUrl(url)
      setStep('preview')
    },
    onValidationError: () => setShowValidationModal(true)
  })

  const handleSave = async (file: File) => {
    if (onSave) {
      await onSave(file)
    }
    handleClose()
  }

  const handleBack = () => {
    setStep('select')
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setSelectedFile(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent title={step === 'select' ? 'Add a Profile Photo' : undefined} className={s.modalContent}>
          <input
            ref={fileUpload.inputRef}
            id={fileUpload.inputId}
            type="file"
            accept="image/jpeg,image/png"
            className={s.hiddenInput}
            onChange={fileUpload.handleFileChange}
          />

          {step === 'select' && <SelectPhotoStep onSelectFile={fileUpload.handleSelectFile} />}

          {step === 'preview' && selectedFile && previewUrl && (
            <PreviewPhotoStep
              imageUrl={previewUrl}
              onBack={handleBack}
              onSave={handleSave}
              originalFile={selectedFile}
            />
          )}
        </DialogContent>
      </Dialog>

      <ProfilePhotoValidationModal open={showValidationModal} onOpenChange={setShowValidationModal} />
    </>
  )
}
