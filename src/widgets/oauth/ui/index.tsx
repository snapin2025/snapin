import { Button, Github, Google } from '@/shared/ui'
import s from './index.module.css'

export const Oauth = () => {
  return (
    <div className={s.container}>
      <Button variant={'textButton'} style={{ color: 'currentColor' }}>
        <Github />
      </Button>
      <Button variant={'textButton'} style={{ color: 'currentColor' }}>
        <Google />
      </Button>
    </div>
  )
}
