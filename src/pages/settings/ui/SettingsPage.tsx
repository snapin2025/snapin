'use client'

import { useSearchParams } from 'next/navigation';

export const SettingsPage = () => {
  const searchParams = useSearchParams();
  const part = searchParams?.get('part') || 'info';

  return (
    <section>
      <h1>Настройки — {part}</h1>
      {part === 'info' && <p>Информация о пользователе</p>}
      {part === 'devices' && <p>Список устройств</p>}
      {part === 'subscriptions' && <p>Подписки</p>}
      {part === 'payments' && <p>История платежей</p>}
    </section>
  );
};