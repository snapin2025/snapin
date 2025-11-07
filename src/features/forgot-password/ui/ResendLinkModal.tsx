import s from './ForgotPasswordForm.module.css'
import { Closes, Typography } from '@/shared/ui'
import { ReactNode } from 'react'

type Props = {
  open: boolean
  onClose?: () => void
  modalTitle: string
  children: ReactNode
}

export const Modal = ({ onClose, open, modalTitle, children }: Props) => {
  if (!open) return null
  return (
    <>
      {open && (
        <div className={s.overlayModal}>
          <div className={s.contentModal}>
            <Closes className={s.closeIcon} onClick={onClose} />
            <Typography className={s.titleModal} variant="h1">
              {modalTitle}
            </Typography>
            <hr />
            {children}
          </div>
        </div>
      )}
    </>
  )
}
