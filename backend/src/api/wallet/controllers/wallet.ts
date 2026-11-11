/**
 * wallet controller — вся логика денежных операций.
 * Пользователь проверяется здесь (jwt users-permissions).
 */

import { walletService } from '../../../services/wallet';

function requireUser(ctx: any) {
  const user = ctx.state.user;
  if (!user) ctx.throw(401, 'Требуется авторизация');
  return user;
}

export default {
  async me(ctx: any) {
    const user = requireUser(ctx);
    const wallet = await walletService.ensureWallet(strapi, user.id);
    const transactions = await strapi.db.query('api::transaction.transaction').findMany({
      where: { wallet: { id: wallet.id } },
      orderBy: { createdAt: 'desc' },
      limit: 50,
    });
    ctx.body = { data: { ...wallet, transactions } };
  },

  async deposit(ctx: any) {
    const user = requireUser(ctx);
    const { amount, reference } = ctx.request.body ?? {};
    const parsed = Number(amount);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      ctx.throw(400, 'amount должен быть целым положительным числом');
    }
    if (parsed > 1_000_000) {
      ctx.throw(400, 'Разовая сумма пополнения не может превышать 1 000 000');
    }

    const result = await walletService.deposit(strapi, {
      userId: user.id,
      amount: parsed,
      reference: reference || `deposit_${user.id}_${Date.now()}`,
    });
    ctx.body = { data: result };
  },

  async withdraw(ctx: any) {
    const user = requireUser(ctx);
    const { amount, reference } = ctx.request.body ?? {};
    const parsed = Number(amount);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      ctx.throw(400, 'amount должен быть целым положительным числом');
    }

    try {
      const result = await walletService.withdraw(strapi, {
        userId: user.id,
        amount: parsed,
        reference: reference || `withdraw_${user.id}_${Date.now()}`,
      });
      ctx.body = { data: result };
    } catch (err: any) {
      ctx.throw(400, err?.message || 'Ошибка списания');
    }
  },

  async purchase(ctx: any) {
    const user = requireUser(ctx);
    const { gameId, reference } = ctx.request.body ?? {};
    if (!gameId) ctx.throw(400, 'gameId обязателен');

    try {
      const result = await walletService.purchaseGame(strapi, {
        userId: user.id,
        gameId: String(gameId),
        reference: reference || `purchase_${user.id}_${gameId}_${Date.now()}`,
      });
      ctx.body = { data: result };
    } catch (err: any) {
      ctx.throw(400, err?.message || 'Ошибка покупки');
    }
  },

  async library(ctx: any) {
    const user = requireUser(ctx);
    const items = await walletService.getLibrary(strapi, user.id, true);
    ctx.body = { data: items };
  },

  async reverse(ctx: any) {
    requireUser(ctx);
    const { reference } = ctx.request.body ?? {};
    if (!reference) ctx.throw(400, 'reference обязателен');

    try {
      const result = await walletService.reverseTransaction(strapi, reference);
      ctx.body = { data: result };
    } catch (err: any) {
      ctx.throw(400, err?.message || 'Ошибка возврата');
    }
  },
};
