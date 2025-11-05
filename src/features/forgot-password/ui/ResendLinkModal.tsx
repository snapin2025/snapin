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
            {/*<p className={s.textModal}>We have sent a link to confirm your email to epam@epam.com</p>*/}
            {/*<Button className={s.buttonModal}>Ok</Button>*/}
          </div>
        </div>
      )}
    </>
  )
}
