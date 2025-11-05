// import { ForgotPasswordForm } from './ForgotPasswordForm'
//
// export default {
//   title: 'Features/ForgotPasswordForm',
//   component: ForgotPasswordForm,
//   parameters: {
//     layout: 'centered'
//   }
// }
//
// export const Default = () => <ForgotPasswordForm />
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { ForgotPasswordModal } from './ForgotPasswordModal'
import LinkOldPage from './LinkOldPage'
import { EmailSentMessage } from '@/features/forgot-password/ui/ EmailSentMessage'
import { CreateNewPassword } from '@/features/forgot-password/ui/CreateNewPassword '

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

// 4. Модальное окно
export const Modal = () => <ForgotPasswordModal />

// 5. Ссылка устарела ← ДОБАВЬ ЭТОТ КОМПОНЕНТ
export const LinkExpired = () => <LinkOldPage />
