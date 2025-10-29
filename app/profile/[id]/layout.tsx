// Обертка над всеми страницами профиля

import { ReactNode } from 'react'

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav>Sidebar профиля</nav>
      <div>{children}</div>
    </div>
  )
}
