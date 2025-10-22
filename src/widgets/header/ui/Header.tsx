import s from './Header.module.css'
import Link from 'next/link'
import { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}
export const Header = ({ children }: Props) => {
  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link className={s.logo} href="/">
          Inctagram
        </Link>
        <div className={s.box}>{children}</div>
      </div>
    </header>
  )
}
