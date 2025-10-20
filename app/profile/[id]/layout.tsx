// Обертка над всеми страницами профиля

export default function ProfileLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <nav>Sidebar профиля</nav>
      <div>{children}</div>
    </div>
  )
}
