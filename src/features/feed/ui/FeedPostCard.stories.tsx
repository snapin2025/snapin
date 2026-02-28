import { FeedPostCard } from './FeedPostCard'
import { MockAuthProvider } from '@/shared/lib'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ComponentType, PropsWithChildren, useState } from 'react'
import type { User } from '@/entities/user'
import type { Meta, StoryObj } from '@storybook/nextjs'

const QueryWrapper = ({ children }: PropsWithChildren) => {
  const [client] = useState(() => new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const mockUser: User = {
  userId: 123,
  userName: 'testuser',
  email: 'test@example.com',
  isBlocked: false
}

const mockPost = {
  id: 1,
  ownerId: 456,
  userName: 'testuser2',
  avatarOwner: 'https://via.placeholder.com/40',
  description: 'Test post description',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  images: [{ url: 'https://via.placeholder.com/600', width: 600, height: 600 }],
  likesCount: 0,
  commentsCount: 0
}

const meta: Meta<typeof FeedPostCard> = {
  title: 'Features/Feed/FeedPostCard',
  component: FeedPostCard,
  parameters: {
    layout: 'centered'
  },
  decorators: [
    (Story: ComponentType) => (
      <QueryWrapper>
        <MockAuthProvider user={mockUser}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Story />
          </div>
        </MockAuthProvider>
      </QueryWrapper>
    )
  ]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // post: mockPost as any,
    currentUserId: 123,
    isFollowing: false
  }
}
