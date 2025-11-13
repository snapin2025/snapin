import { useState } from 'react'

import { BaseModal, DialogClose } from '@/shared/ui/modal'
import { Meta, StoryObj } from '@storybook/nextjs'
import { Button } from '@/shared/ui'

const meta = {
  title: 'Components/BaseModal',
  component: BaseModal,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof BaseModal>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Примечание: истории ниже демонстрируют разные конфигурации `BaseModal`.
 * Меняйте триггер открытия и структуру контента под конкретный сценарий,
 * а состояние `open` всегда контролируйте снаружи через проп `onOpenChange`.
 */
export const WithHeader: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <div>
        {/* Кнопка здесь как триггер для открытия модалки
        На проекте вместо кнопки будет какойто другой элемент на который будем вешать setOpen(true) */}
        <Button onClick={() => setOpen(true)}>Открыть модалку</Button>
        <BaseModal title={'Заголовок модалки!'} open={open} onOpenChange={setOpen}>
          {/* Основной контент модалки располагается здесь. *
          *сюда также можно добавлять кнопки закрытия и другие элементы управления модалки
          их можно посмотреть в Modal.tsx

          */}
          Я Модалка ! Очень счастливая и разнообразная!
        </BaseModal>
      </div>
    )
  }
}

export const WithoutHeader: Story = {
  render: () => {
    const [open, setOpen] = useState(true)
    {
      /* если нужно без хедера просто прокидываешь
      пропсом showCloseButton={false} и не прокидываешь title

          */
    }
    return (
      <div>
        <Button onClick={() => setOpen(true)}>Открыть модалку</Button>
        <BaseModal showCloseButton={false} open={open} onOpenChange={setOpen}>
          <p>Я модалка! НЕ Очень счастливая и НЕ разнообразная!</p>
        </BaseModal>
      </div>
    )
  }
}

export const WithCloseButton: Story = {
  render: () => {
    const [open, setOpen] = useState(true)

    return (
      <div>
        <Button onClick={() => setOpen(true)}>Открыть модалку</Button>
        <BaseModal title={'Ура!'} open={open} onOpenChange={setOpen}>
          <p>у меня есть кнопка )) Ширина модалки устанавливается по контенту !</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <DialogClose asChild>
              <Button>Закрыть</Button>
            </DialogClose>
          </div>
        </BaseModal>
      </div>
    )
  }
}
