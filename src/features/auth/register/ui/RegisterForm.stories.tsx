import type { StoryObj } from '@storybook/nextjs'
import SignUpForm, { RegisterForm } from '@/features/auth/register/ui/RegisterForm'

const meta = {
  title: 'Components/RegisterForm',
  component: SignUpForm,
  parameters: {
    layout: 'centered'
  }
}

export default meta

type Story = StoryObj<typeof meta>
type RegisterFormProps = {
  initialErrors?: {
    userName?: string
    email?: string
    password?: string
    passwordConfirmation?: string
  }
}
export const Default: Story = {
  args: {}
}

// 🔴 С ошибками
export const WithErrors: Story = {
  args: {
    error: 'ZZZZZZZZZZ'
  },
  render: () => <RegisterForm />
}

export const Prefilled: Story = {
  args: {},
  render: () => <RegisterForm />
}
