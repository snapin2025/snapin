// 'use client'
// import s from './ForgotPasswordForm.module.css'
// import { useState } from 'react'
// import { Modal } from '@/features/auth/forgot-password/ui/ResendLinkModal'
// import { Button } from '@/shared/ui'
// import { EmailSentMessage } from '@/features/auth/forgot-password/ui/EmailSentMessage'
//
// export const ForgotPasswordModal = () => {
//   const [showModal, setShowModal] = useState(true) //если заменить на true будет открываться
//
//   return (
//     <>
//       <EmailSentMessage onResendClick={() => setShowModal(true)} />
//       <Modal modalTitle={'Email sent'} open={showModal} onClose={() => setShowModal(false)}>
//         <p className={s.textModal}>We have sent a link to confirm your email to epam@epam.com</p>
//         <Button className={s.buttonModal} onClick={() => setShowModal(false)}>
//           Ok
//         </Button>
//       </Modal>
//     </>
//   )
// }
