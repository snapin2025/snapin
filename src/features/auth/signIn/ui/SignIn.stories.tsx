import type { StoryObj } from '@storybook/nextjs'
import { SignIn } from '@/features/auth/signIn'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren, useMemo, useState } from 'react'
import { AuthContext } from '@/shared/lib'

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

const QueryWrapper = ({ children }: PropsWithChildren) => {
  const [client] = useState(() => new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const MockAuthProvider = ({ children }: PropsWithChildren) => {
  const contextValue = useMemo(
    () => ({
      user: null,
      isLoading: false,
      isError: false
    }),
    []
  )
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const Default: Story = {
  render: () => (
    <QueryWrapper>
      <MockAuthProvider>
        <SignIn />
      </MockAuthProvider>
    </QueryWrapper>
  ),
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/auth/signin',
        query: {}
      }
    }
  }
}
