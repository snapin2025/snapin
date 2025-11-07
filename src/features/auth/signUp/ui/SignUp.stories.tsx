import type { StoryObj } from '@storybook/nextjs'
import SignUpForm, { SignUp } from '@/features/auth/signUp/ui/SignUp'

const meta = {
  title: 'Components/SignUp',
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
  render: () => <SignUp />
}

export const Prefilled: Story = {
  args: {},
  render: () => <SignUp />
}
