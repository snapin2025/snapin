'use client'

import { BaseModal, Button, Typography } from '@/shared/ui'
import s from './PhotoValidationModal.module.css'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const PhotoValidationModal = ({ open, onOpenChange }: Props) => {
  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <BaseModal open={open} onOpenChange={handleClose} title="Photo requirements">
      <Typography variant="regular_16" className={s.textModal}>
        The uploaded photo does not meet the requirements.
      </Typography>
      <Typography variant="regular_16" className={s.textModal}>
        Requirements for the uploaded photo: format - <b>JPEG/PNG</b>, size - <b>not more than 20 MB</b>
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <Button className={s.buttonModal} onClick={handleClose}>
          Ok
        </Button>
      </div>
    </BaseModal>
  )
}
