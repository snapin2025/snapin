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

import { CommonModal } from './commonModal/CommonModal'
import { useState } from 'react'
import { Meta, StoryObj } from '@storybook/nextjs'
import { Button } from '@/shared/ui'

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
        </DialogHeader>
        <div style={{ padding: '20px 0' }}>
          <p>Основной контент модального окна</p>
        </div>
      </DialogContent>
    </Dialog>
  )
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
          <DialogDescription>Это действие нельзя отменить. Ваш аккаунт будет удален навсегда.</DialogDescription>
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
          <DialogDescription>Закрыть можно только через кнопку или клик вне модалки</DialogDescription>
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
              <DialogDescription>Состояние модалки управляется через useState</DialogDescription>
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

// ========== CommonModal Stories ==========

// Простая CommonModal
export const CommonModalSimple: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Открыть CommonModal</Button>
        <CommonModal open={open} onOpenChange={setOpen} title="Простая модалка">
          <div style={{ padding: '20px 0' }}>
            <p>Основной контент передается через children</p>
          </div>
        </CommonModal>
      </>
    )
  }
}

// CommonModal с подтверждением
export const CommonModalConfirmation: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    const handleConfirm = () => {
      alert('Действие подтверждено!')
      setOpen(false)
    }

    return (
      <>
        <Button variant="outlined">Удалить фото</Button>
        <CommonModal
          open={open}
          onOpenChange={setOpen}
          title="Удалить фото?"
          description="Вы уверены, что хотите удалить это фото? Это действие нельзя отменить."
        >
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleConfirm}>Удалить</Button>
          </div>
        </CommonModal>
      </>
    )
  }
}

// CommonModal без кнопки закрытия
export const CommonModalWithoutCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Обязательное действие</Button>
        <CommonModal
          open={open}
          onOpenChange={setOpen}
          title="Обязательное действие"
          description="Эта модалка не имеет кнопки закрытия в углу"
          showCloseButton={false}
        >
          <div style={{ padding: '20px 0' }}>
            <p>Вы должны выбрать одно из действий</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Отклонить
            </Button>
            <Button onClick={() => setOpen(false)}>Принять</Button>
          </div>
        </CommonModal>
      </>
    )
  }
}
