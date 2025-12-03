'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

import { Bookmark, Home, Logout, Message, PlusSquare, Profile, Search, TrendingIcon } from '@/shared/ui'

import { useLogout } from '@/features/auth/logout/api/useLogout'

import s from './sidebar.module.css'

type NavItem = {
  name: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Create', href: '/create', icon: PlusSquare },
  { name: 'My Profile', href: '/profile', icon: Profile },
  { name: 'Messenger', href: '/messenger', icon: Message },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Statistics', href: '/statistics', icon: TrendingIcon },
  { name: 'Favorites', href: '/favorites', icon: Bookmark }
]

export const Sidebar = () => {
  const pathname = usePathname()
  const { mutate: handleLogout } = useLogout()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  return (
    <nav className={s.container}>
      <div className={s.content}>
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon

        return (
            <Link key={item.name} href={item.href} className={clsx(s.link, active && s.active)}>
              <Icon className={s.icon} />
              <span className={s.text}>{item.name}</span>
          </Link>
        )
      })}

        <button onClick={() => handleLogout()} className={s.logout}>
          <Logout className={s.icon} />
          <span className={s.text}>Log Out</span>
        </button>
    </div>
    </nav>
  )
}
