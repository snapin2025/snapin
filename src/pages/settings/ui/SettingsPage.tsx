import { SETTINGS_PART } from '@/shared/lib/routes'

type Props = {
  searchParams: {
    part?: string
  }
}
export const SettingsPage = ({ searchParams }: Props) => {
  const part = searchParams.part ?? 'info'
  switch (part) {
    case SETTINGS_PART.DEVICES:
      return <div>Устройства</div>

    case SETTINGS_PART.SUBSCRIPTIONS:
      return <div>Подписки</div>

    case SETTINGS_PART.PAYMENTS:
      return <div>Платежи</div>

    default:
      return <div>Информация пользователя</div>
  }
}
