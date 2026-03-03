// сторис для лайков
import { LikeButton } from './LikeButton'
import { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof LikeButton> = {
  title: 'Features/view-post/LikeButton',
  component: LikeButton,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof LikeButton>

// ✅ Просто кнопка-сердечко. Без логики, без onClick
export const Default: Story = {
  args: {
    postId: 1,
    initialIsLiked: false
  }
}

// // ✅ Для проверки залитого состояния (когда добавишь)
// export const Liked: Story = {
//   args: {
//     postId: 1,
//     initialIsLiked: true
//   }
// }
