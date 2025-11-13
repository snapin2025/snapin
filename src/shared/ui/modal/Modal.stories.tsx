import type { StoryObj } from '@storybook/nextjs'
import type { ReactElement } from 'react'
import { Button } from '@/shared/ui'
import { Dialog, DialogContent, DialogTrigger } from './Modal'
import s from './modal.module.css'
const centeredDecorator = (Story: () => ReactElement) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: 0
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
    <div>
      <Dialog {...args}>
        <DialogTrigger asChild>
          <Button variant="primary">Открыть модалку</Button>
        </DialogTrigger>
        <DialogContent className={s.w} title="Заголовок окна">
          <p>Основной контент модалки располагается здесь.</p>
          <p>Основной контент модалки располаfddгается здесь.</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
