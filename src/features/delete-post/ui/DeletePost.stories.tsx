import type { Meta, StoryObj } from '@storybook/nextjs'
import { DeletePost } from './DeletePost'

const meta = {
  title: 'Features/DeletePost',
  component: DeletePost,
  tags: ['autodocs'],
  args: {
    id: 1
  }
} satisfies Meta<typeof DeletePost>

export default meta

type Story = StoryObj<typeof meta>
export const DeletePostButton: Story = {
  render: () => (
    <div>
      <DeletePost id={2} />
    </div>
  )
}
