import { ForgotPasswordForm } from './ForgotPasswordForm'
import { ForgotPasswordModal } from './ForgotPasswordModal'
import LinkOldPage from './LinkOldPage'
import { EmailSentMessage } from '@/features/forgot-password/ui/EmailSentMessage'
import s from './ForgotPasswordForm.module.css'
import { Button } from '@/shared/ui'
import { Modal } from '@/features/forgot-password/ui/ResendLinkModal'
import { CreateNewPassword } from '@/features/forgot-password/ui/CreateNewPassword'

export default {
  title: 'Features/ForgotPassword',
  parameters: {
    layout: 'centered'
  }
}

// 1. Основная форма
export const DefaultForm = () => <ForgotPasswordForm />

// 2. Сообщение "Email отправлен"
export const EmailSent = () => <EmailSentMessage />

// 3. Создание нового пароля
export const CreatePassword = () => <CreateNewPassword />

// 5. Компонент Modal (само окно) отдельно
export const ModalStory = () => (
  <Modal open={true} modalTitle="Email sent" onClose={() => {}}>
    <p className={s.textModal}>We have sent a link to confirm your email to epam@epam.com</p>
    <Button className={s.buttonModal}>OK</Button>
  </Modal>
)

// 4. Модальное окно  на поверх на форме
export const ModalWindow = () => <ForgotPasswordModal />

// 5. Ссылка устарела
export const LinkExpired = () => <LinkOldPage />
