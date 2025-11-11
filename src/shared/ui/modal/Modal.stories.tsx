import type { Meta, StoryObj } from '@storybook/react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './Modal'
import { Button } from '../button/Button'
import { Input } from '../input/Input'
import { useState } from 'react'

const meta = {
  title: 'Shared/Modal',
  component: Dialog,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

// Простая модалка
export const Simple: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Открыть модалку</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Заголовок модального окна</DialogTitle>
          <DialogDescription>
            Это описание модального окна. Здесь можно разместить дополнительную информацию.
          </DialogDescription>
        </DialogHeader>
        <div style={{ padding: '20px 0' }}>
          <p>Основной контент модального окна</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Модалка с формой
export const WithForm: Story = {
  render: () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Войти</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Вход в аккаунт</DialogTitle>
            <DialogDescription>Введите ваши данные для входа</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              console.log({ email, password })
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 0' }}
          >
            <Input
              label="Email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Пароль"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outlined">Отмена</Button>
            </DialogClose>
            <Button type="submit">Войти</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
}

// Модалка с подтверждением
export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outlined">Удалить аккаунт</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы уверены?</DialogTitle>
          <DialogDescription>
            Это действие нельзя отменить. Ваш аккаунт будет удален навсегда.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter style={{ marginTop: '24px' }}>
          <DialogClose asChild>
            <Button variant="outlined">Отмена</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="primary">Удалить</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Модалка без кнопки закрытия
export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Открыть без крестика</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Модалка без крестика</DialogTitle>
          <DialogDescription>
            Закрыть можно только через кнопку или клик вне модалки
          </DialogDescription>
        </DialogHeader>
        <DialogFooter style={{ marginTop: '24px' }}>
          <DialogClose asChild>
            <Button>Закрыть</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Контролируемая модалка
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div style={{ display: 'flex', gap: '12px' }}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Открыть контролируемую модалку</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Контролируемая модалка</DialogTitle>
              <DialogDescription>
                Состояние модалки управляется через useState
              </DialogDescription>
            </DialogHeader>
            <div style={{ padding: '20px 0' }}>
              <p>Модалка открыта: {open ? 'Да' : 'Нет'}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Закрыть программно</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="outlined" onClick={() => setOpen(true)}>
          Открыть снаружи
        </Button>
      </div>
    )
  }
}

