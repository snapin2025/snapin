import s from './ForgotPasswordForm.module.css'
import { Typography } from '@/shared/ui'
import { ReactNode } from 'react'
import { Closes } from '@/shared/ui/icons/Closes';

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
            <hr className={s.hr} />
            {children}
          </div>
        </div>
      )}
    </>
  )
}
