import type { StoryObj } from '@storybook/nextjs'
import { SignUp } from '@/features/auth/sign-up/ui/SignUp'

const meta = {
  title: 'Components/SignUp',
  component: SignUp,
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
  args: {
    isLoading: false,
    error: null
    // onSubmit: async (data) => {
    //   console.log('Форма отправлена:', data)
    //   return Promise.resolve({ statusCode: 204 })
    // }
  }
}
