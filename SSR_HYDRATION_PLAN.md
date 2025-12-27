# План реализации SSR + TanStack Query Hydration для страницы профиля

## Цель
Реализовать Server-Side Rendering (SSR) с Hydration для страницы профиля пользователя, чтобы данные загружались на сервере и передавались клиенту для улучшения SEO и производительности.

## Анализ текущей ситуации

### Ключевые факты:
1. ✅ Профиль находится в `(public)` роуте - данные публичные
2. ✅ Токен хранится только в `localStorage` (не в cookies)
3. ✅ RefreshToken в cookies, но используется только для обновления accessToken
4. ❌ `QueryProvider` создает один `QueryClient` на весь app (проблема для SSR)
5. ❌ Данные загружаются только на клиенте после монтирования
6. ❌ API interceptor использует `localStorage`, который недоступен на сервере

### Текущая архитектура:
- `ProfilePage` (серверный компонент) → `ProfilePageClient` (клиентский)
- `ProfilePageClient` использует `useProfileData` → `useUserProfile` + `useUserPosts`
- Все запросы выполняются на клиенте через `api` инстанс с interceptor

### Решение:
- Для SSR делаем прямые axios запросы (обходя interceptor с localStorage)
- Так как профиль публичный - запросы можно делать без токена
- Если токен понадобится - можно получить через `/auth/update` используя refreshToken из cookies

## Упрощенный план реализации

### Шаг 1: Обновить QueryProvider для поддержки SSR

**Файл:** `src/app/providers/query-provider/query-provider.tsx`

**Задачи:**
1. Создать функцию `makeQueryClient()` для создания нового QueryClient
2. Использовать `useState` для создания QueryClient один раз на клиенте
3. Добавить поддержку `dehydratedState` через `HydrationBoundary`

**Изменения:**
```typescript
'use client'

import { QueryClient, QueryClientProvider, HydrationBoundary } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useState } from 'react'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 минута
      },
    },
  })
}

export function QueryProvider({ 
  children,
  dehydratedState 
}: { 
  children: ReactNode
  dehydratedState?: unknown 
}) {
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {dehydratedState ? (
        <HydrationBoundary state={dehydratedState}>
          {children}
        </HydrationBoundary>
      ) : (
        children
      )}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
```

---

### Шаг 2: Создать утилиту для предзагрузки данных на сервере

**Файл:** `src/shared/lib/prefetch/prefetch-posts.ts` (новый файл)

**Задачи:**
1. Создать функцию `getQueryClient()` для создания QueryClient на сервере
2. Создать прямые axios запросы (обходя interceptor)
3. Создать функции prefetch для профиля и постов
4. Создать функцию `dehydrate()` для сериализации состояния

**Реализация:**
```typescript
import { QueryClient } from '@tanstack/react-query'
import { dehydrate } from '@tanstack/react-query'
import axios from 'axios'
import { UserProfileResponse } from '@/entities/user/api/user-types'
import { ResponsesPosts } from '@/entities/posts/api/types'

// Создает новый QueryClient для каждого запроса (SSR)
export function getQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

// Прямой axios запрос (обходит interceptor с localStorage)
async function fetchUserProfile(userName: string): Promise<UserProfileResponse> {
  const { data } = await axios.get<UserProfileResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userName}`,
    {
      withCredentials: true, // для отправки cookies (refreshToken)
    }
  )
  return data
}

// Прямой axios запрос для постов
async function fetchUserPosts(
  userId: number,
  pageSize: number = 8,
  endCursorPostId?: number
): Promise<ResponsesPosts> {
  const url = endCursorPostId
    ? `${process.env.NEXT_PUBLIC_API_URL}/posts/user/${userId}/${endCursorPostId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/posts/user/${userId}`
  
  const { data } = await axios.get<ResponsesPosts>(url, {
    params: { pageSize },
    withCredentials: true,
  })
  return data
}

// Предзагрузка профиля
export async function prefetchUserProfile(
  queryClient: QueryClient,
  userName: string
) {
  await queryClient.prefetchQuery({
    queryKey: ['user-profile', userName],
    queryFn: () => fetchUserProfile(userName),
    staleTime: 2 * 60 * 1000, // 2 минуты
  })
}

// Предзагрузка постов
export async function prefetchUserPosts(
  queryClient: QueryClient,
  userId: number,
  pageSize: number = 8
) {
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['user-posts', userId, pageSize],
    queryFn: ({ pageParam }: { pageParam: number | null }) =>
      fetchUserPosts(userId, pageSize, pageParam ?? undefined),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage.items || lastPage.items.length === 0) return null
      if (lastPage.items.length < pageSize) return null
      const lastPost = lastPage.items[lastPage.items.length - 1]
      return lastPost?.id ?? null
    },
  })
}

// Предзагрузка всех данных профиля
export async function prefetchProfileData(userId: number) {
  const queryClient = getQueryClient()
  
  try {
    // Сначала загружаем посты, чтобы получить userName
    await prefetchUserPosts(queryClient, userId)
    
    // Получаем userName из кэша
    const postsData = queryClient.getQueryData<{
      pages: Array<{ items: Array<{ userName?: string }> }>
    }>(['user-posts', userId, 8])
    
    const userName = postsData?.pages[0]?.items[0]?.userName
    
    // Если userName получен, загружаем профиль
    if (userName) {
      await prefetchUserProfile(queryClient, userName)
    }
  } catch (error) {
    // Если предзагрузка не удалась - не критично, клиент повторит запрос
    console.error('Prefetch error:', error)
  }
  
  return dehydrate(queryClient)
}
```

---

### Шаг 3: Обновить ProfilePage для предзагрузки данных

**Файл:** `src/pages/profile/ProfilePage.tsx`

**Задачи:**
1. Импортировать `prefetchProfileData`
2. Вызвать предзагрузку на сервере
3. Передать `dehydratedState` в `ProfilePageClient`

**Изменения:**
```typescript
import { ProfilePageClient } from '@/features/user-profile/ui/ProfilePageClient'
import { prefetchProfileData } from '@/shared/lib/prefetch/prefetch-utils'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

type ProfilePageProps = {
  params: Promise<{ id?: string }>
}

export async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params
  const userId = Number(id)

  if (!id || Number.isNaN(userId) || userId <= 0) {
    return <div>Профиль не найден</div>
  }

  // Предзагружаем данные на сервере
  const dehydratedState = await prefetchProfileData(userId)

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProfilePageClient userId={userId} />
    </HydrationBoundary>
  )
}
```

---

### Шаг 4: Убрать лишний код из ProfilePageClient (опционально)

**Файл:** `src/features/user-profile/ui/ProfilePageClient.tsx`

**Задачи:**
- Проверить, что компонент корректно работает с предзагруженными данными
- Убедиться, что React Query использует кэш вместо повторных запросов

**Примечание:**
- Если данные предзагружены, React Query автоматически использует их из кэша
- Дополнительных изменений не требуется

---

## Технические детали

### Структура файлов после реализации:

```
src/
├── app/
│   └── providers/
│       └── query-provider/
│           └── query-provider.tsx (обновлен)
├── shared/
│   ├── api/
│   │   └── instance.ts (без изменений)
│   └── lib/
│       └── prefetch/
│           └── prefetch-posts.ts (новый)
└── pages/
    └── profile/
        └── ProfilePage.tsx (обновлен)
```

### Зависимости:

Все необходимые зависимости уже установлены:
- `@tanstack/react-query` - для QueryClient и HydrationBoundary
- `next` - для SSR
- `axios` - для HTTP запросов

### Важные моменты:

1. **QueryClient на сервере:**
   - Создается заново для каждого запроса
   - Не кэшируется между запросами

2. **Прямые axios запросы:**
   - Обходят interceptor с localStorage
   - Используют `withCredentials: true` для отправки cookies (refreshToken)
   - Не требуют accessToken для публичных данных

3. **Обработка ошибок:**
   - Если предзагрузка не удалась - страница все равно работает
   - Клиент повторит запрос автоматически

4. **Получение userName:**
   - Сначала загружаем посты (они содержат userName)
   - Затем загружаем профиль по userName
   - Если userName не получен - профиль не загрузится на SSR (но загрузится на клиенте)

---

## Порядок выполнения

1. **Шаг 1** - Обновить QueryProvider (основа для всего)
2. **Шаг 2** - Создать prefetch-utils (прямые axios запросы)
3. **Шаг 3** - Обновить ProfilePage (использовать prefetch)
4. **Шаг 4** - Проверить ProfilePageClient (должен работать автоматически)

---

## Ожидаемый результат

После реализации:
- ✅ Страница профиля рендерится на сервере с данными
- ✅ Данные передаются клиенту через hydration
- ✅ Нет дублирования запросов (React Query использует кэш)
- ✅ Улучшен SEO (данные в HTML)
- ✅ Быстрее первый рендер (данные уже загружены)
- ✅ Сохранена функциональность клиентской навигации
- ✅ Работает для публичных профилей без авторизации

---

## Что НЕ нужно делать

❌ Создавать отдельный серверный API инстанс  
❌ Получать токен из cookies (его там нет)  
❌ Синхронизировать localStorage с cookies  
❌ Менять существующие API функции  
❌ Обновлять RootLayout  
❌ Создавать сложную логику получения токена

**Причина:** Профиль публичный, токен не нужен для загрузки данных. Прямые axios запросы решают проблему.
