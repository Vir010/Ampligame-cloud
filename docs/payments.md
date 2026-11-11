# Деньги: пополнение, списание, покупки

Вся денежная логика живёт на бэкенде (`backend/src/services/wallet.ts`). Фронтенд только вызывает API — баланс в localStorage больше не хранится.

## Модель данных

| Тип | Таблица | Назначение |
|---|---|---|
| `Wallet` | `wallets` | баланс пользователя, 1:1 с `up_users` |
| `Transaction` | `transactions` | журнал: deposit / withdraw / purchase / refund |
| `LibraryItem` | `library_items` | купленные игры, статус `owned` / `installed` / `refunded` |

Статус игры после покупки: `purchaseCount + 1`, `lastPurchasedAt`, при заполненном `stock` уменьшается остаток, и при нуле `purchasable = false`.

## API

Все endpoint'ы требуют JWT пользователя: `Authorization: Bearer <token>` (JWT выдаёт `POST /api/auth/local` или `/api/auth/local/register`).

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/wallets/me` | кошелёк + последние 50 транзакций |
| POST | `/api/wallets/deposit` | `{ amount, reference? }` — пополнение |
| POST | `/api/wallets/withdraw` | `{ amount, reference? }` — списание |
| POST | `/api/wallets/purchase` | `{ gameId, reference? }` — покупка |
| GET | `/api/wallets/library` | библиотека пользователя |
| POST | `/api/wallets/reverse` | `{ reference }` — возврат/откат |

Фронтенд обращается к ним через серверный прокси Next.js: `/api/wallet/wallets/*` (`frontend/src/app/api/wallet/[...path]/route.ts`), который проверяет наличие JWT и пробрасывает запрос в Strapi.

Маршруты кошелька объявлены с `auth: false`, поэтому не зависят от состояния таблицы `up_permissions`. Пользователя определяет middleware `backend/src/middlewares/wallet-auth.ts` (проверяет JWT через сервис users-permissions и кладёт его в `ctx.state.user`), контроллер отвечает 401 без пользователя.

## Защита от двойного списания

1. **`SELECT ... FOR UPDATE`** на строке кошелька внутри `strapi.db.transaction` — параллельные покупки выстраиваются в очередь.
2. **Условный `UPDATE`**: `WHERE id = ? AND balance = <прочитанный баланс>` — если баланс изменился, операция падает с ошибкой конфликта, а не перезаписывает чужое значение.
3. **UNIQUE `transactions.reference`** — повтор запроса с тем же ключом не списывает и не начисляет дважды (идемпотентность).
4. **UNIQUE `(wallet_id, game_id)`** в `library_items` — игру нельзя купить дважды.
5. **`CHECK (balance >= 0)`** — PostgreSQL физически не даст уйти в минус.
6. Один `strapi.db.transaction` на покупку: списание, запись в библиотеку и обновление статуса игры коммитятся вместе или откатываются вместе.

## PostgreSQL

В `config/database.ts` уже есть готовая конфигурация для postgres. В `.env`:

```
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=unifiedstack
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
```

Быстрый старт локальной БД: `docker compose up -d` (сервис `postgres` в корне репозитория).

Ограничения и индексы накладываются автоматически при старте Strapi (`bootstrap` → `runWalletMigration`), миграция идемпотентна.

## Проверка

```bash
# сиды (при остановленном Strapi)
cd backend && node scripts/seed-games.js

# тесты денежной логики
node tests/money-e2e.js

# тест прокси Next.js (Next запущен на :3100)
cd frontend && node tests/proxy-e2e.js
```

`money-e2e.js` проверяет: пополнение, идемпотентность, отказ при нехватке средств, **5 параллельных покупок одной игры — успешна ровно одна**, библиотеку, статус игры (`purchaseCount`, `stock`, `lastPurchasedAt`), журнал и возврат.
