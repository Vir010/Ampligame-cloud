# UnifiedStack

Монорепозиторий проекта Ampligame: Next.js фронтенд + Strapi CMS бэкенд.

## Структура

- `frontend/` — Next.js 16 + React 19 + Tailwind 4 (магазин игр, форум, профиль и т.д.)
- `backend/` — Strapi 5 CMS (API для фронтенда, SQLite по умолчанию)

## Требования

- Node.js 20+
- npm

## Запуск бэкенда (Strapi)

```bash
cd backend
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run develop        # API: http://localhost:1337, админка: http://localhost:1337/admin
```

## Запуск фронтенда (Next.js)

```bash
cd frontend
npm install
npm run dev            # http://localhost:3000
```

Фронтенд обращается к Strapi по адресу из `NEXT_PUBLIC_STRAPI_URL` (по умолчанию `http://127.0.0.1:1337`).
Создайте `frontend/.env.local`, если адрес API отличается:

```
NEXT_PUBLIC_STRAPI_URL=http://127.0.0.1:1337
```

## Сборка

```bash
cd backend && npm run build
cd ../frontend && npm run build
```
