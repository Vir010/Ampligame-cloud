/**
 * Миграция кошелька: защита на уровне БД.
 *
 * Выполняется при старте Strapi (bootstrap) и идемпотентна.
 * Для PostgreSQL:
 *   - CHECK (balance >= 0) — баланс не может уйти в минус;
 *   - уникальный индекс по transactions.reference — идемпотентность операций;
 *   - индекс library_items (wallet_id, game_id) — уникальность покупки.
 *
 * Для остальных клиентов (sqlite/mysql) проверки дублируются в приложении.
 */

import type { Core } from '@strapi/strapi';

const PG_STATEMENTS = [
  `ALTER TABLE wallets ADD CONSTRAINT wallets_balance_non_negative CHECK (balance >= 0)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS transactions_reference_unique ON transactions (reference)`,
  `CREATE INDEX IF NOT EXISTS transactions_wallet_created_idx ON transactions (wallet_id, created_at DESC)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS library_items_wallet_game_unique ON library_items (wallet_id, game_id)`,
  `CREATE INDEX IF NOT EXISTS games_purchasable_idx ON games (purchasable)`,
];

function isPostgres(strapi: Core.Strapi): boolean {
  const client = String((strapi.db.connection as any)?.client?.config?.client ?? '');
  return client.includes('postgres');
}

export async function runWalletMigration(strapi: Core.Strapi): Promise<void> {
  if (!isPostgres(strapi)) {
    strapi.log.info('[wallet] Не PostgreSQL — ограничения уровня БД пропущены');
    return;
  }

  const knex = strapi.db.connection as any;

  for (const statement of PG_STATEMENTS) {
    try {
      await knex.raw(statement);
    } catch (err: any) {
      // Дубликаты ограничений (42P07 / 42710) и нарушение CHECK на грязных данных (23514)
      const code = err?.code;
      if (code === '42P07' || code === '42710') continue;
      if (code === '23514') {
        strapi.log.warn(
          '[wallet] Отрицательный баланс в wallets — ограничение CHECK не наложено: ' + err.message
        );
        continue;
      }
      strapi.log.warn(`[wallet] Миграция: ${statement} -> ${err.message}`);
    }
  }

  strapi.log.info('[wallet] Миграция БД для транзакций применена');
}

export default runWalletMigration;
