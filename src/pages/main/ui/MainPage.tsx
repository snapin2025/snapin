'use client';
// Главная страница
// Доступна всем (в т.ч. авторизованным пользователям)
// Отличается наличием сайдбара и кнопками в хедере

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function MainPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams?.get('code');
    const email = searchParams?.get('email');
    console.log([code, email]);
    if (code && email) {
      // Перенаправляем на страницу подтверждения регистрации
      router.replace(`/auth/confirm?code=${code}&email=${email}`);
    }
  }, [searchParams, router]);

  return <div>Hello{/*Счетчик и 4 поста*/}</div>;
}
