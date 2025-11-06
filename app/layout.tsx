// Общая обертка над каждой страницей
import type { Metadata } from 'next'
import './styles/index.css'
import { QueryProvider } from '@/shared/providers/ReactQueryProvider'

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
        <QueryProvider>
          <header>Header</header>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
