import type { StoryObj } from '@storybook/nextjs'
import type { ReactElement } from 'react'
import { Button } from '@/shared/ui'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from './Modal'

const centeredDecorator = (Story: () => ReactElement) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}
  >
    <Story />
  </div>
)

const meta = {
  title: 'Components/Modal',
  component: Dialog,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [centeredDecorator]
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultOpen: true
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="primary">Открыть модалку</Button>
      </DialogTrigger>
      <DialogContent title="Заголовок окна">
        <p>Основной контент модалки располагается здесь.</p>
        <p>Основной контент модалки располагается здесь.</p>
        <p>Основной контент модалки располагается здесь.</p>
        <p>Основной контент модалки располагается здесь.</p>
        <p>Основной контент модалки располаfddгается здесь.</p>
      </DialogContent>
    </Dialog>
  )
}
