'use strict';

async function getUserIdFromJwt(ctx: any): Promise<number | null> {
  if (ctx.state?.user?.id) return ctx.state.user.id;

  const auth = ctx.request?.header?.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;

  try {
    const decoded = await strapi.plugins['users-permissions'].services.jwt.verify(token);
    if (decoded?.id) {
      ctx.state.user = { id: decoded.id };
      return decoded.id;
    }
    return null;
  } catch {
    return null;
  }
}

export default {
  async myTransactions(ctx: any) {
    const userId = await getUserIdFromJwt(ctx);
    if (!userId) return ctx.unauthorized('Требуется авторизация');

    const list = await strapi.db.query('api::wallet.transaction').findMany({
      where: { user: userId },
      orderBy: { id: 'desc' },
    });

    return { data: list };
  },

  async reverse(ctx: any) {
    const userId = await getUserIdFromJwt(ctx);
    if (!userId) return ctx.unauthorized('Требуется авторизация');

    const { transactionId } = ctx.request.body || {};
    if (!transactionId) return ctx.badRequest('Не передан transactionId');

    const tx = await strapi.db.query('api::wallet.transaction').findOne({
      where: { id: Number(transactionId) },
      populate: { user: true },
    });

    if (!tx) return ctx.notFound('Транзакция не найдена');

    // Проверка владельца (IDOR): чужая транзакция -> 403 Forbidden
    const ownerId = tx.user?.id ?? tx.wallet?.user?.id;
    if (String(ownerId) !== String(userId)) {
      return ctx.forbidden('Нет доступа к чужой транзакции');
    }

    if (tx.status === 'reversed') return ctx.badRequest('Транзакция уже возвращена');
    if (tx.type !== 'purchase') return ctx.badRequest('Возврат возможен только для покупок');

    const amount = Number(tx.amount) || 0;

    await strapi.db.query('api::wallet.transaction').update({
      where: { id: tx.id },
      data: { status: 'reversed' },
    });

    if (amount > 0) {
      const owner = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: userId },
      });
      const currentBalance = Number(owner?.balance) || 0;

      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: { balance: currentBalance + amount },
      });
    }

    await strapi.db.query('api::wallet.transaction').create({
      data: {
        amount,
        type: 'reverse',
        status: 'success',
        reference: `reverse_of_${tx.id}`,
        user: userId,
      },
    });

    return { success: true, message: 'Транзакция возвращена', transactionId: tx.id };
  },

  async adminReverse(ctx: any) {
    const userId = await getUserIdFromJwt(ctx);
    if (!userId) return ctx.unauthorized('Требуется авторизация');

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: userId },
      populate: { role: true },
    });

    const roleType = String(user?.role?.type || '').toLowerCase();
    const roleName = String(user?.role?.name || '').toLowerCase();
    if (roleType !== 'admin' && roleName !== 'admin') {
      return ctx.forbidden('Доступно только администратору');
    }

    const { transactionId } = ctx.request.body || {};
    if (!transactionId) return ctx.badRequest('Не передан transactionId');

    const tx = await strapi.db.query('api::wallet.transaction').findOne({
      where: { id: Number(transactionId) },
      populate: { user: true },
    });

    if (!tx) return ctx.notFound('Транзакция не найдена');
    if (tx.status === 'reversed') return ctx.badRequest('Транзакция уже возвращена');

    const amount = Number(tx.amount) || 0;
    const ownerId = tx.user?.id;

    await strapi.db.query('api::wallet.transaction').update({
      where: { id: tx.id },
      data: { status: 'reversed' },
    });

    if (ownerId && amount > 0) {
      const owner = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: ownerId },
      });
      const currentBalance = Number(owner?.balance) || 0;

      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: ownerId },
        data: { balance: currentBalance + amount },
      });
    }

    await strapi.db.query('api::wallet.transaction').create({
      data: {
        amount,
        type: 'reverse',
        status: 'success',
        reference: `admin_reverse_of_${tx.id}`,
        user: ownerId || null,
      },
    });

    return { success: true, message: 'Админский возврат выполнен', transactionId: tx.id };
  },
};
