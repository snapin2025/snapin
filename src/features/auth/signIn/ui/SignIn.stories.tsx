import type { StoryObj } from '@storybook/nextjs'
import { SignIn } from '@/features/auth/signIn'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

const meta = {
  title: 'Features/Auth/SignIn',
  component: SignIn,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true
    }
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [client] = useState(() => new QueryClient())
    return (
      <QueryClientProvider client={client}>
        <SignIn />
      </QueryClientProvider>
    )
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/auth/signin',
        query: {}
      }
    }
  }
}
