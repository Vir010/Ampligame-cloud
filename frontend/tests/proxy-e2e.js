/**
 * Проверка сквозного пути: Next.js прокси (/api/wallet/*) → Strapi.
 * Запуск: node tests/proxy-e2e.js
 */

const FRONT = process.env.FRONT_URL || 'http://127.0.0.1:3000';
const STRAPI = process.env.STRAPI_URL || 'http://127.0.0.1:1337';

function assert(cond, message) {
  if (!cond) {
    console.error('FAIL:', message);
    process.exitCode = 1;
    throw new Error(message);
  }
  console.log('ok  -', message);
}

async function main() {
  const ts = Date.now() + Math.floor(Math.random() * 1000);
  const reg = await fetch(`${STRAPI}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: `px${ts}`,
      email: `px${ts}${Math.random().toString(36).slice(2, 7)}@example.com`,
      password: 'Passw0rd!',
    }),
  }).then((r) => r.json());

  assert(!!reg.jwt, 'пользователь Strapi создан');
  const auth = { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.jwt}` };

  const deposit = await fetch(`${FRONT}/api/wallet/wallets/deposit`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ amount: 2500, reference: `proxy_dep_${ts}` }),
  }).then((r) => r.json());
  assert(deposit?.data?.balance === 2500, `пополнение через прокси: ${deposit?.data?.balance}`);

  const me = await fetch(`${FRONT}/api/wallet/wallets/me`, { headers: auth }).then((r) => r.json());
  assert(me?.data?.balance === 2500, 'баланс читается через прокси');

  const unauth = await fetch(`${FRONT}/api/wallet/wallets/me`);
  assert(unauth.status === 401, 'без токена прокси отвечает 401');

  const games = await fetch(`${STRAPI}/api/games?pagination[limit]=5`, { headers: auth }).then((r) => r.json());
  const game = games?.data?.[0];
  assert(!!game, 'игра доступна');

  const gameId = game.documentId ?? game.id;
  const price = Number(game.Price ?? 0);

  const purchase = await fetch(`${FRONT}/api/wallet/wallets/purchase`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ gameId, reference: `proxy_buy_${ts}` }),
  }).then((r) => r.json());

  assert(purchase?.data?.balance === 2500 - price, `покупка списала ${price}, баланс ${purchase?.data?.balance}`);
  assert(!!purchase?.data?.libraryItem, 'запись в библиотеке создана');

  const lib = await fetch(`${FRONT}/api/wallet/wallets/library`, { headers: auth }).then((r) => r.json());
  assert(Array.isArray(lib?.data) && lib.data.length === 1, 'библиотека через прокси');

  const incorrect = await fetch(`${FRONT}/api/wallet/wallets/deposit`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ amount: -100 }),
  });
  assert(incorrect.status === 400, 'отрицательное пополнение отклонено');

  console.log('\nПрокси работает корректно.');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
