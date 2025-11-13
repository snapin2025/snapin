'use client'

import { useAuth } from '@/shared/providers/auth-provider'

export function MainPage() {
  const { user, isLoading, isError } = useAuth()

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error</p>
  if (!user) return <p>Not logged in</p>
  return (
    <div>
      <h1>Welcome {user.userName}</h1>
      <p>Email: {user.email}</p>
    </div>
  )
}
