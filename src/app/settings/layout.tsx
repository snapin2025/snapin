// Обертка над всеми страницами настроек

export default function SettingsLayout({children}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/*Возможность переключения вкладок*/}
      <nav>
        <a href="/settings?part=info">Инфо</a> |{' '}
        <a href="/settings?part=devices">Устройства</a> |{' '}
        <a href="/settings?part=subscriptions">Подписки</a> |{' '}
        <a href="/settings?part=payments">Платежи</a>
      </nav>

      <div>
        {/*Рендер текущей вкладки */}
        {children}
      </div>
    </div>
  )
}