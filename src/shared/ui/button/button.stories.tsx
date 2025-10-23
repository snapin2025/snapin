import type { Meta, StoryObj } from '@storybook/nextjs'
import { Button } from '@/shared/ui/button/Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  }
} //satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Button',
    disabled: false,
    variant: 'primary'
  }
}

export const Secondary: Story = {
  args: {
    children: 'Button',
    disabled: false,
    variant: 'secondary'
  }
}

export const Outlened: Story = {
  args: {
    children: 'Button',
    disabled: false,
    variant: 'outlined'
  }
}

export const Text: Story = {
  args: {
    children: 'Button',
    disabled: false,
    variant: 'textButton'
  }
}

export const LinkAsButton: Story = {
  args: {
    asChild: true,
    children: <a href="#">Link</a>,
    disabled: false,
    variant: 'primary'
  }
}
