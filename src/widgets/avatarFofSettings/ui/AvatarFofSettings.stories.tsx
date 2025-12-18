import type { Meta, StoryObj } from '@storybook/nextjs'
import { AvatarFofSettings } from '@/widgets/avatarFofSettings/ui/AvatarFofSettings'

const meta = {
  title: 'Widgets/AvatarFofSettings',
  component: AvatarFofSettings,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof AvatarFofSettings>

export const Default: Story = {}

export default meta
type Story = StoryObj<typeof meta>
