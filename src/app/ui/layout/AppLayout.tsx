'use client'
import { useAuth } from '@/shared/lib'
import { Button, Spinner } from '@/shared/ui'
import { Header } from '@/widgets'
import Link from 'next/link'
import { ReactNode } from 'react'
import { ROUTES } from '@/shared/lib/routes'

export const AppLayout = ({ children }: { children?: ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Spinner />
  const isAuth = !!user
  return (
    <div>
      <>
        {/* Гостевой или авторизованный хедер */}
        {isAuth ? (
          <Header />
        ) : (
          <Header>
            <nav>
              <ul style={{ display: 'flex', gap: '24px' }}>
                <li>
                  <Button asChild variant={'textButton'}>
                    <Link href={ROUTES.AUTH.SIGN_IN}>Log in</Link>
                  </Button>
                </li>
                <li>
                  <Button asChild variant={'primary'}>
                    <Link href={ROUTES.AUTH.SIGN_UP}>Sign up</Link>
                  </Button>
                </li>
              </ul>
            </nav>
          </Header>
        )}
        {isAuth && <aside>Тут сайдбар</aside>}
        {/* Контент страницы */}
        <main>{children}</main>
      </>
    </div>
  )
}
