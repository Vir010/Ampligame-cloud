/**
 * Сиды для локальной разработки: тестовые игры + кошелёк демо-пользователя.
 * Запуск: node scripts/seed-games.js  (Strapi должен быть остановлен)
 *
 * Пишет прямо в БД Strapi через document service, поэтому не требует прав API.
 */

const path = require('path');

const GAMES = [
  {
    Title: 'Cyber Realm 2077',
    Price: 1990,
    Description: 'Тестовая RPG в неоновом мегаполисе.',
    developer: 'UnifiedStack Studio',
    Genre: 'RPG',
    Platform: 'PC',
    game_year: 2026,
    stock: 10,
    purchasable: true,
    purchaseCount: 0,
    isSale: false,
  },
  {
    Title: 'Neon Drift',
    Price: 750,
    Description: 'Аркадные гонки будущего.',
    developer: 'UnifiedStack Studio',
    Genre: 'Racing',
    Platform: 'PC',
    game_year: 2025,
    stock: 5,
    purchasable: true,
    purchaseCount: 0,
    isSale: true,
    oldPrice: 990,
  },
  {
    Title: 'Dungeon of Echoes',
    Price: 1200,
    Description: 'Рогалик с процедурными подземельями.',
    developer: 'UnifiedStack Studio',
    Genre: 'Roguelike',
    Platform: 'PC',
    game_year: 2024,
    stock: 20,
    purchasable: true,
    purchaseCount: 0,
  },
];

async function seedStrapi() {
  const { createStrapi } = require('@strapi/strapi');
  const strapi = await createStrapi({ appDir: path.resolve(__dirname, '..'), distDir: './dist' }).load();

  for (const game of GAMES) {
    const existing = await strapi.db.query('api::game.game').findOne({
      where: { Title: game.Title },
    });
    if (existing) {
      console.log('есть:', game.Title);
      continue;
    }
    const created = await strapi.db.query('api::game.game').create({
      data: { ...game, publishedAt: new Date() },
    });
    console.log('создана:', game.Title, '#', created.id);
  }

  await strapi.destroy();
}

async function seedApi() {
  const API = process.env.API_URL || 'http://127.0.0.1:1337';
  for (const game of GAMES) {
    const res = await fetch(`${API}/api/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: game }),
    });
    const body = await res.json().catch(() => ({}));
    console.log(game.Title, '->', res.status, body?.data?.documentId ?? body?.error?.message);
  }
}

const useApi = process.argv.includes('--api');
(useApi ? seedApi() : seedStrapi()).catch((err) => {
  console.error(err);
  process.exit(1);
});
