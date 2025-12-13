import { ProfilePageClient } from '@/features/user-profile/ui/ProfilePageClient'

type ProfilePageProps = {
  params: Promise<{ id?: string }>
}

/**
 * Серверный компонент страницы профиля.
 * Получает userId из параметров URL и передает в клиентский компонент.
 */
export async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params
  const userId = Number(id)

  if (!id || Number.isNaN(userId) || userId <= 0) {
    return <div>Профиль не найден</div>
  }

  return <ProfilePageClient userId={userId} />
}
