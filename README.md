# Ampligame-cloud

Облачный гейминг (Cloud Gaming) на **Next.js 16** (frontend) + **Strapi 5** (backend).

---

## Задача

- **Сверстать тарифы** (Лайт / Комфорт / Премиум).
- **Сделать визуальный таймер сессии** и **вывод очереди**.
- **Подключить интерфейс к серверной логике оплаты** (списание/возврат баланса, покупка игр, карточки, значки).

---

## Что сделано (список изменённых / добавленных файлов)

### 🔧 Backend (Strapi)

| Файл | Что внутри |
|---|---|
| `backend/src/api/cloud/routes/cloud.ts` | Роуты: `POST /cloud/start-session`, `POST /cloud/stop-session`, `GET /cloud/active-session`, `GET /cloud/queue`, `GET /cloud/balance` |
| `backend/src/api/cloud/controllers/cloud.ts` | Логика сессий (60 мин), списание/возврат, тестовая очередь (PlayerOne, ShadowMaster), баланс в памяти |
| `backend/src/api/payment/routes/payment.ts` | Роут `POST /payment/top-up` |
| `backend/src/api/payment/controllers/payment.ts` | Пополнение баланса (mock-платёж) |
| `backend/src/api/library/routes/library.ts` | Роуты: `GET /library`, `POST /library/buy`, `POST /library/buy-cards`, `DELETE /library/remove/:gameId` |
| `backend/src/api/library/controllers/library.ts` | Покупка игры (списание), покупка карточек (50 ₽/шт), удаление из библиотеки |

> ⚠️ **Mock-логика:** баланс, сессии и библиотека хранятся в памяти (`global.*`) и сбрасываются при перезапуске Strapi. Для продакшена — заменить на коллекции Strapi (SQLite).

---

### 💻 Frontend (Next.js)

#### Cloud Gaming

| Файл | Что внутри |
|---|---|
| `frontend/src/app/cloud/page.tsx` | Страница Cloud Gaming: тарифы из Strapi, таймер, очередь, покупка |
| `frontend/src/components/cloud/TariffCard.tsx` | Карточка тарифа (заголовок, фичи, цена, кнопка «Купить»/«Активен») |
| `frontend/src/components/cloud/SessionTimer.tsx` | Визуальный таймер (ЧЧ:ММ), прогресс-бар, синхронизация с сервером раз в 30 с, кнопка «Завершить» |
| `frontend/src/components/cloud/QueueDisplay.tsx` | Очередь: polling раз в 5 с, позиция пользователя, список первых 5 |
| `frontend/src/lib/cloudApi.ts` | `startCloudSession`, `stopCloudSession`, `getActiveSession`, `getQueue`, `getBalance`, `topUpBalance` |
| `frontend/src/styles/cloudgame.css` | Стили `.tariff-card-new`, `.tariff-btn` |

#### Оплата / Баланс

| Файл | Что внутри |
|---|---|
| `frontend/src/components/balance/BalanceModal.tsx` | Модалка пополнения: `POST /api/payment/top-up`, событие `balanceUpdated` |
| `frontend/src/components/layout/TopBar.tsx` | Баланс берётся с сервера (`getBalance`), слушает `balanceUpdated` |

#### Магазин / Библиотека

| Файл | Что внутри |
|---|---|
| `frontend/src/app/store/page.tsx` | Получение игр из Strapi, маппинг `Title/Price/Cover` |
| `frontend/src/components/store/GameGrid.tsx` | Рендер карточек `GameCard` с единым объектом `game` |
| `frontend/src/components/store/GameCard.tsx` | Кнопка «Купить» → `POST /api/library/buy` + бонус 3 карточки |
| `frontend/src/app/library/page.tsx` | Вкладки: Библиотека (с сервера), Wishlist, Карточки (+ магазин карточек за 50 ₽) |
| `frontend/src/components/library/LibraryCard.tsx` | Карточка игры в библиотеке: «Установить» (торрент) + «Удалить» (через API) |
| `frontend/src/components/library/SteamCard.tsx` | Карточка с обложкой игры (fallback — буква названия) |

#### Карточки и значки

| Файл | Что внутри |
|---|---|
| `frontend/src/lib/libraryApi.ts` | `getLibrary`, `buyGame`, `buyCards`, `removeFromLibrary` |
| `frontend/src/lib/steamCards.ts` | `grantCardsForGame` (3 шт. с обложкой), `craftBadge` (5 уникальных → 1 значок), `hasBadgeForGame`, `pruneCards`, авто-дедупликация значков |
| `frontend/src/components/ui/Icons.tsx` | SVG-иконки: `IconBadge`, `IconTrophy`, `IconTarget`, `IconCart`, `IconCheck`, `IconHammer` |

#### Профиль

| Файл | Что внутри |
|---|---|
| `frontend/src/app/profile/page.tsx` | Блок «Значки» (SVG + виджет при наведении), достижения, игры с сервера |

#### Storage

| Файл | Что внутри |
|---|---|
| `frontend/src/lib/storage.ts` | Per-user ключи (`user_steam_cards`, `user_crafted_badges` добавлены в `PER_USER_KEYS`) |

---

## Как запустить

### Backend (Strapi)

```bash
cd backend
npm install
npm run develop
# → http://localhost:1337/admin
