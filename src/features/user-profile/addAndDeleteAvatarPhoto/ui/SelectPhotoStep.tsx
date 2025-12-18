'use client'

import { Button } from '@/shared/ui'
import { SvgImage } from '@/shared/ui/icons/SvgImage'
import s from './SelectPhotoStep.module.css'
import { AvatarFofSettings } from '@/widgets/avatarFofSettings/ui/AvatarFofSettings'

type Props = {
  onSelectFile: () => void
}

export const SelectPhotoStep = ({ onSelectFile }: Props) => {
  return (
    <div className={s.container}>
      <div className={s.placeholder}>
        <SvgImage width={48} height={48} />
      </div>
      <Button onClick={onSelectFile}>Select from Computer</Button>
    </div>
  )
}
