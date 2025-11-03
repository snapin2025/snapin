import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ReactNode } from 'react'
import { Providers } from '@/shared/lib'

import '../src/app/styles/index.css'

const interFont = localFont({
  src: [
    { path: '../public/fonts/Inter-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/Inter-Medium.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/Inter-SemiBold.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/Inter-Bold.woff2', weight: '700', style: 'normal' }
  ],
  display: 'swap', // улучшает UX и performance
  preload: true //
})

export const metadata: Metadata = {
  title: 'Inctagram',
  description: 'Учебный проект'
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className={interFont.className}>
      <body>
        <Providers>
          <header>Header</header>
          {children}
        </Providers>
      </body>
    </html>
  )
}
