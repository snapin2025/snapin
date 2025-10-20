// Общая обертка над каждой страницей
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inctagram',
  description: 'Учебный проект'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <header>Header</header>
        {children}
      </body>
    </html>
  )
}
