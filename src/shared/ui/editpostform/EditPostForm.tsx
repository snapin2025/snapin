'use client'

import Image from 'next/image'
import { Dialog } from '@/shared/ui/temp/dialog'
import { Textarea } from '@/shared/ui/textarea'
import { PostCard } from '@/shared/ui/post'
import { Card } from '@/shared/ui'
import s from './editpostform.module.css'
import { Button } from '@/shared/ui/button/Button'
export type EditPostFormProps = {
  isOpen: boolean
  onClose: () => void
}

export const EditPostForm = ({ isOpen, onClose }: EditPostFormProps) => {
  return (
    <Dialog title="Edit Post" open={isOpen} onOpenChange={onClose} className={s.dialog}>
      <Card className={s.wrapper}>
        {/* Картинка поста */}
        <div className={s.imgBox}>
          <Image src="/img.png" alt="Post" width={490} height={503} className={s.img} />
        </div>

        {/* Форма */}
        <div className={s.form}>
          <PostCard
            userName="UserName"
            avatar="/girl.png"
            showDropMenu={false} // ← отключаем три точки
            showActions={false} // ← отключаем Answer
            className={s.post}
          />

          <Textarea
            label="Add publication descriptions"
            value="Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.."
            maxLength={500}
          />
          {/*  счетчик*/}
          <div className={s.counter}>0/500</div>

          <Button variant="primary" className={s.button} onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </Card>
    </Dialog>
  )
}
