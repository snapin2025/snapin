# AGENTS.md

## Краткое описание проекта

Snapin — фронтенд на Next.js 15 (App Router) + React 19 + TypeScript. Архитектура FSD: `shared → entities → features → widgets → pages`, с инфраструктурным слоем `app`. Используются React Query для серверного состояния, axios для API и socket.io-client для realtime уведомлений.

## Команды

- Установка зависимостей: `npm install`
- Запуск dev-сервера: `npm run dev`
- Линтер: `npm run lint`
- Форматирование: `npm run prettier` или `npm run format:fix`
- Тесты: отдельной команды нет (в `package.json` отсутствуют test‑скрипты)

## Наблюдаемые правила стиля кода

- TypeScript в строгом режиме (`"strict": true`).
- Абсолютные импорты через алиас `@/*` (см. `tsconfig.json`).
- CSS Modules для стилей компонентов.
- Компоненты в основном с именованными экспортами; layouts часто реэкспортируются из `src/app/ui`.
- React Query используется для данных (query/mutation hooks лежат в `entities/*/model` или `features/*/api`).
- API‑слой через общий axios инстанс `src/shared/api/instance.ts`.
- FSD‑слои соблюдаются: верхние слои импортируют нижние, но не наоборот.
- Реалтайм (notifications) реализован через socket.io и синхронизацию с кешем React Query.

## Структура проекта

```
/app                          # App Router: маршруты и layouts
/src
  app/                        # инфраструктура: layouts, providers, глобальные стили
  shared/                     # UI‑кит, утилиты, общие API, константы
  entities/                   # доменные сущности (API, model, types)
  features/                   # бизнес‑фичи и use‑cases
  widgets/                    # крупные UI‑композиции
  pages/                      # page‑level UI (НЕ маршруты Next)
/public                       # статика
```

### Примечание по маршрутам

Роутинг определяется только в `/app`. `src/pages` — это UI‑страницы, которые подключаются в `app/*/page.tsx`.
