import { CurrentSubscription } from './CurrentSubscription'
import { Meta, StoryObj } from '@storybook/nextjs'

const meta: Meta<typeof CurrentSubscription> = {
  title: 'UI/CurrentSubscription',
  component: CurrentSubscription,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof CurrentSubscription>

// ПЕРЕДАЙ ДАННЫЕ КАК В МАКЕТЕ!
export const Default: Story = {
  args: {
    expireDate: '12.02.2022',
    nextPaymentDate: '13.02.2022'
  }
}
