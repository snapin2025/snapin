// сторис для формы написания  коментариев
import { CommentForm } from './CommentForm'
import { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof CommentForm> = {
  title: 'shared/CommentForm',
  component: CommentForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', background: '#434343', width: '500px' }}>
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof CommentForm>

// ✅ Одна простая история
export const Default: Story = {
  args: {
    postId: 1
  }
}
