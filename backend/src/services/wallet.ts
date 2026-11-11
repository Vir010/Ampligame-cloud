/**
 * wallet service
 *
 * Ядро денежной логики. Все операции записи выполняются в одной транзакции БД
 * с блокировкой строки кошелька (SELECT ... FOR UPDATE), что защищает от
 * двойного списания при одновременных запросах.
 *
 * Работает на PostgreSQL; на остальных клиентах (sqlite/mysql) транзакция
 * выполняется без явных блокировок, но с проверкой версии строки (optimistic).
 */

import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

const { ApplicationError } = errors;

export type TxType = 'deposit' | 'withdraw' | 'purchase' | 'refund';

export interface WalletRow {
  id: number;
  balance: number;
}

interface PurchaseArgs {
  userId: number | string;
  gameId: string;
  reference: string;
}

const POCKET_POINTS_PER_PURCHASE = 50;

/**
 * Гарантирует наличие кошелька у пользователя. Идемпотентно.
 */
async function ensureWallet(strapi: Core.Strapi, userId: number | string) {
  const existing = await strapi.db.query('api::wallet.wallet').findOne({
    where: { user: { id: userId } },
  });
  if (existing) return existing;

  return strapi.db.query('api::wallet.wallet').create({
    data: {
      user: userId,
      balance: 0,
      currency: 'RUB',
    },
  });
}

/**
 * Блокирующая выборка кошелька внутри транзакции.
 * Postgres: SELECT ... FOR UPDATE. Иначе — обычная выборка.
 */
async function lockWallet(
  strapi: Core.Strapi,
  trx: any,
  walletId: number
): Promise<WalletRow> {
  const knex = trx.getKnex ? trx.getKnex() : (strapi.db.connection as any);
  const client = String((strapi.db.connection as any)?.client?.config?.client ?? 'sqlite');

  if (client.includes('postgres') && knex?.raw) {
    const res = await knex.raw('SELECT id, balance FROM wallets WHERE id = ? FOR UPDATE', [
      walletId,
    ]);
    const row = res?.rows?.[0] ?? res?.[0]?.[0];
    if (!row) throw new ApplicationError('Кошелёк не найден');
    // Strapi добавляет префикс таблиц только при заданном tableName prefix.
    return { id: Number(row.id), balance: Number(row.balance) };
  }

  const wallet = await strapi.db.query('api::wallet.wallet').findOne({ where: { id: walletId } });
  if (!wallet) throw new ApplicationError('Кошелёк не найден');
  return { id: Number(wallet.id), balance: Number(wallet.balance ?? 0) };
}

/**
 * Запись транзакции в журнал. reference уникален — повторная запись с тем же
 * reference считается повтором (идемпотентность) и не создаётся.
 */
async function recordTransaction(
  strapi: Core.Strapi,
  data: {
    walletId: number;
    type: TxType;
    amount: number;
    balanceBefore: number;
    balanceAfter: number;
    reference: string;
    gameId?: string | number | null;
    metadata?: Record<string, unknown>;
    status?: 'pending' | 'completed' | 'failed' | 'reversed';
  }
) {
  const duplicate = await strapi.db.query('api::transaction.transaction').findOne({
    where: { reference: data.reference },
  });
  if (duplicate) {
    throw new ApplicationError('Транзакция с таким reference уже существует');
  }

  return strapi.db.query('api::transaction.transaction').create({
    data: {
      wallet: data.walletId,
      type: data.type,
      amount: data.amount,
      balanceBefore: data.balanceBefore,
      balanceAfter: data.balanceAfter,
      status: data.status ?? 'completed',
      reference: data.reference,
      game: data.gameId ?? null,
      metadata: data.metadata ?? {},
    },
  });
}

/**
 * Универсальное движение средств. delta > 0 — пополнение, delta < 0 — списание.
 * Всё атомарно: блокировка кошелька + обновление баланса + журнал.
 */
async function move(
  strapi: Core.Strapi,
  params: {
    userId: number | string;
    type: TxType;
    amount: number;
    reference: string;
    gameId?: string | number | null;
    metadata?: Record<string, unknown>;
    extra?: (trx: any, walletId: number) => Promise<Record<string, unknown> | void>;
  }
) {
  const wallet = await ensureWallet(strapi, params.userId);
  const signedAmount = params.type === 'withdraw' || params.type === 'purchase'
    ? -Math.abs(params.amount)
    : Math.abs(params.amount);

  return strapi.db.transaction(async (trx) => {
    const locked = await lockWallet(strapi, trx, Number(wallet.id));
    const before = locked.balance;
    const after = before + signedAmount;

    if (after < 0) {
      throw new ApplicationError(
        `Недостаточно средств: баланс ${before}, требуется ${Math.abs(signedAmount)}`
      );
    }

    // Условное обновление: сработает только если баланс не изменился
    // между выборкой и апдейтом (защита от гонок вне Postgres).
    const updated = await strapi.db
      .query('api::wallet.wallet')
      .updateMany({
        where: { id: locked.id, balance: before },
        data: { balance: after },
      });

    if (!updated || updated.count === 0) {
      throw new ApplicationError('Конфликт обновления баланса, повторите операцию');
    }

    const extraResult = params.extra ? await params.extra(trx, locked.id) : undefined;

    const transaction = await recordTransaction(strapi, {
      walletId: locked.id,
      type: params.type,
      amount: signedAmount,
      balanceBefore: before,
      balanceAfter: after,
      reference: params.reference,
      gameId: params.gameId ?? null,
      metadata: params.metadata,
    });

    return {
      balance: after,
      walletId: locked.id,
      transaction,
      ...(extraResult ?? {}),
    };
  });
}

/**
 * Пополнение баланса.
 */
async function deposit(
  strapi: Core.Strapi,
  args: { userId: number | string; amount: number; reference: string }
) {
  const wallet = await ensureWallet(strapi, args.userId);
  const existing = await strapi.db.query('api::transaction.transaction').findOne({
    where: { reference: args.reference },
  });
  if (existing) {
    // Идемпотентность: повторный вызов с тем же reference не начисляет повторно.
    return {
      balance: wallet.balance,
      walletId: wallet.id,
      transaction: existing,
      idempotent: true,
    };
  }

  return move(strapi, {
    userId: args.userId,
    type: 'deposit',
    amount: args.amount,
    reference: args.reference,
    metadata: { channel: 'manual' },
  });
}

/**
 * Списание средств.
 */
async function withdraw(
  strapi: Core.Strapi,
  args: { userId: number | string; amount: number; reference: string }
) {
  return move(strapi, {
    userId: args.userId,
    type: 'withdraw',
    amount: args.amount,
    reference: args.reference,
  });
}

/**
 * Покупка игры.
 *
 * Одна транзакция:
 *  1. блокировка кошелька (FOR UPDATE) — защита от двойного списания;
 *  2. проверка, что игра ещё не куплена;
 *  3. списание баланса;
 *  4. запись в библиотеку (LibraryItem);
 *  5. обновление статуса игры: purchaseCount += 1, lastPurchasedAt, purchasable=false
 *     для лицензионных игр / isOwned=true для текущего пользователя.
 */
async function purchaseGame(strapi: Core.Strapi, args: PurchaseArgs) {
  const wallet = await ensureWallet(strapi, args.userId);

  const game = await strapi.db.query('api::game.game').findOne({
    where: { $or: [{ documentId: args.gameId }, { id: Number(args.gameId) || -1 }] },
  });
  if (!game) throw new ApplicationError('Игра не найдена');
  if (game.purchasable === false) {
    throw new ApplicationError('Игра недоступна для покупки');
  }

  const price = Number(game.Price ?? 0);
  if (price < 0) throw new ApplicationError('Некорректная цена игры');

  const alreadyOwned = await strapi.db.query('api::library-item.library-item').findOne({
    where: {
      wallet: { id: wallet.id },
      game: { id: game.id },
      status: { $ne: 'refunded' },
    },
  });
  if (alreadyOwned) {
    throw new ApplicationError('Игра уже приобретена');
  }

  const existingTx = await strapi.db.query('api::transaction.transaction').findOne({
    where: { reference: args.reference },
  });
  if (existingTx) {
    return { balance: wallet.balance, transaction: existingTx, game, idempotent: true };
  }

  if (price === 0) {
    // Бесплатная игра: списание не нужно, но покупка всё равно логируется.
    return strapi.db.transaction(async (trx) => {
      const locked = await lockWallet(strapi, trx, Number(wallet.id));
      const item = await createLibraryItem(strapi, locked.id, game, 0);
      await bumpGameStatus(strapi, game);
      const transaction = await recordTransaction(strapi, {
        walletId: locked.id,
        type: 'purchase',
        amount: 0,
        balanceBefore: locked.balance,
        balanceAfter: locked.balance,
        reference: args.reference,
        gameId: game.id,
        metadata: { free: true, title: game.Title },
      });
      return { balance: locked.balance, transaction, game, libraryItem: item };
    });
  }

  const result = await move(strapi, {
    userId: args.userId,
    type: 'purchase',
    amount: price,
    reference: args.reference,
    gameId: game.id,
    metadata: { title: game.Title, price },
    extra: async (_trx, walletId) => {
      const item = await createLibraryItem(strapi, walletId, game, price);
      await bumpGameStatus(strapi, game);
      return { libraryItem: item, game };
    },
  });

  return result;
}

/**
 * Создание записи в библиотеке + обновление статуса игры у пользователя.
 */
async function createLibraryItem(strapi: Core.Strapi, walletId: number, game: any, price: number) {
  return strapi.db.query('api::library-item.library-item').create({
    data: {
      wallet: walletId,
      game: game.id,
      status: 'owned',
      pricePaid: price,
      purchasedAt: new Date(),
    },
  });
}

/**
 * Обновление статуса игры после покупки:
 *  - счётчик покупок;
 *  - дата последней покупки;
 *  - если у игры ограниченный тираж (stock), уменьшаем и блокируем при нуле.
 */
async function bumpGameStatus(strapi: Core.Strapi, game: any) {
  const data: Record<string, unknown> = {
    purchaseCount: Number(game.purchaseCount ?? 0) + 1,
    lastPurchasedAt: new Date(),
  };

  if (typeof game.stock === 'number') {
    const left = game.stock - 1;
    data.stock = left;
    data.purchasable = left > 0;
  }

  return strapi.db.query('api::game.game').update({
    where: { id: game.id },
    data,
  });
}

/**
 * Возврат (откат) транзакции: компенсирующая операция + пометка исходной.
 */
async function reverseTransaction(strapi: Core.Strapi, reference: string) {
  const original = await strapi.db.query('api::transaction.transaction').findOne({
    where: { reference },
    populate: { wallet: true, game: true },
  });
  if (!original) throw new ApplicationError('Транзакция не найдена');
  if (original.status === 'reversed') throw new ApplicationError('Транзакция уже отменена');

  const walletId = original.wallet?.id;
  if (!walletId) throw new ApplicationError('У транзакции нет кошелька');

  return strapi.db.transaction(async (trx) => {
    const locked = await lockWallet(strapi, trx, Number(walletId));
    const refund = Math.abs(Number(original.amount));
    const after = locked.balance + refund;

    await strapi.db
      .query('api::wallet.wallet')
      .updateMany({
        where: { id: locked.id, balance: locked.balance },
        data: { balance: after },
      });

    await strapi.db.query('api::transaction.transaction').update({
      where: { id: original.id },
      data: { status: 'reversed' },
    });

    await recordTransaction(strapi, {
      walletId: locked.id,
      type: 'refund',
      amount: refund,
      balanceBefore: locked.balance,
      balanceAfter: after,
      reference: `${reference}_refund_${Date.now()}`,
      gameId: original.game?.id ?? null,
      metadata: { reversedReference: reference },
    });

    if (original.game?.id) {
      const item = await strapi.db.query('api::library-item.library-item').findOne({
        where: { wallet: { id: locked.id }, game: { id: original.game.id } },
      });
      if (item) {
        await strapi.db.query('api::library-item.library-item').update({
          where: { id: item.id },
          data: { status: 'refunded' },
        });
      }
    }

    return { balance: after, reversed: reference };
  });
}

/**
 * Библиотека пользователя.
 */
async function getLibrary(strapi: Core.Strapi, userId: number | string, includeGame = true) {
  const wallet = await ensureWallet(strapi, userId);
  return strapi.db.query('api::library-item.library-item').findMany({
    where: { wallet: { id: wallet.id } },
    populate: includeGame ? { game: true } : {},
    orderBy: { purchasedAt: 'desc' },
  });
}

export const walletService = {
  ensureWallet,
  move,
  deposit,
  withdraw,
  purchaseGame,
  reverseTransaction,
  getLibrary,
  recordTransaction,
  POCKET_POINTS_PER_PURCHASE,
};

export default walletService;
