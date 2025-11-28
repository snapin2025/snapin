'use client'
import s from './header.module.css'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Typography } from '@/shared/ui'

type Props = {
  children?: ReactNode
}

export const Header = ({ children }: Props) => {
  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link className={s.logo} href="/">
          <Typography variant={'large'} asChild>
            <span>Inctagram</span>
          </Typography>
        </Link>
        <div className={s.box}>{children}</div>
      </div>
    </header>
  )
}
