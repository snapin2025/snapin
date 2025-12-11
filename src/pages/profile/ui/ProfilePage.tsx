import { use } from 'react'

export function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <section>{id}</section>
}
