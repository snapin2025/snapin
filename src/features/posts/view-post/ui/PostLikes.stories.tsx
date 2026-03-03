// сториз для лайков

import { PostLikes } from './PostLikes'
import { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof PostLikes> = {
  title: 'PostLikes',
  component: PostLikes
}
export default meta
type Story = StoryObj<typeof PostLikes>

export const Default: Story = {
  args: {
    likesCount: 3,
    avatars: [
      'https://api.dicebear.com/9.x/initials/svg?seed=User1&backgroundColor=ff6b6b',
      'https://api.dicebear.com/9.x/initials/svg?seed=User2&backgroundColor=4ecdc4',
      'https://api.dicebear.com/9.x/initials/svg?seed=User3&backgroundColor=ffe66d'
    ]
  }
}
