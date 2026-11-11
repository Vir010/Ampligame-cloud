const SESSION_MINUTES_DEFAULT = 60;

export default {
  async startSession(userId: number, tariffId: string) {
    const tariff: any = await strapi.db.query('api::tariff.tariff').findOne({
      where: { documentId: tariffId },
    });
    if (!tariff) throw new Error('Тариф не найден');

    const price = Number(tariff.Price) || 0;
    if (price <= 0) throw new Error('Некорректная цена тарифа');

    const activeSession: any = await strapi.db.query('api::session.session').findOne({
      where: { user: userId, status: 'active' },
    });
    if (activeSession) throw new Error('У вас уже есть активная сессия');

    const waitingQueue: any = await strapi.db.query('api::queue.queue').findOne({
      where: { user: userId, status: 'waiting' },
    });
    if (waitingQueue) throw new Error('Вы уже стоите в очереди');

    const updated: any = await strapi.db.query('plugin::users-permissions.user').update({
      where: {
        id: userId,
        balance: { $gte: price },
      },
      data: {
        balance: { $decr: price },
        activeTariff: tariff.id,
      },
    });
    if (!updated) throw new Error(`Недостаточно средств. Нужно ${price} ₽`);

    const now = new Date();
    try {
      const session: any = await strapi.db.query('api::session.session').create({
        data: {
          user: userId,
          tariff: tariff.id,
          startedAt: now.toISOString(),
          minutesUsed: 0,
          minutesTotal: SESSION_MINUTES_DEFAULT,
          status: 'active',
        },
      });

      await strapi.db.query('api::queue.queue').create({
        data: {
          user: userId,
          joinedAt: now.toISOString(),
          status: 'waiting',
        },
      });

      return {
        session: {
          id: session.id,
          minutesTotal: session.minutesTotal,
          minutesUsed: 0,
          startedAt: session.startedAt,
          status: 'active',
        },
        tariff: { id: tariff.documentId, Title: tariff.Title, Price: price },
        newBalance: Number(updated.balance),
      };
    } catch (err) {
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: { balance: { $incr: price } },
      });
      throw err;
    }
  },

  async stopSession(userId: number) {
    const session: any = await strapi.db.query('api::session.session').findOne({
      where: { user: userId, status: 'active' },
      populate: ['tariff'],
    });
    if (!session) throw new Error('Активная сессия не найдена');

    const now = new Date();
    const startedAt = new Date(session.startedAt);
    const minutesElapsed = Math.max(
      0,
      Math.floor((now.getTime() - startedAt.getTime()) / 60000)
    );
    const minutesUsed = Math.min(minutesElapsed, session.minutesTotal);
    const minutesLeft = Math.max(0, session.minutesTotal - minutesUsed);

    let refund = 0;
    if (session.tariff && session.tariff.Price && session.minutesTotal > 0) {
      const pricePerMin = Number(session.tariff.Price) / session.minutesTotal;
      refund = Math.floor(pricePerMin * minutesLeft);
    }

    if (refund > 0) {
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: userId },
        data: { balance: { $incr: refund } },
      });
    }

    await strapi.db.query('api::session.session').update({
      where: { id: session.id },
      data: {
        endedAt: now.toISOString(),
        minutesUsed,
        status: 'finished',
      },
    });

    await strapi.db.query('api::queue.queue').updateMany({
      where: { user: userId, status: { $in: ['waiting', 'playing'] } },
      data: { status: 'finished' },
    });

    return { minutesUsed, minutesLeft, refund, endedAt: now.toISOString() };
  },

  async getActiveSession(userId: number) {
    const session: any = await strapi.db.query('api::session.session').findOne({
      where: { user: userId, status: 'active' },
      populate: ['tariff'],
    });
    if (!session) return null;

    const now = new Date();
    const startedAt = new Date(session.startedAt);
    const minutesElapsed = Math.floor((now.getTime() - startedAt.getTime()) / 60000);
    const minutesUsed = Math.min(minutesElapsed, session.minutesTotal);
    const minutesLeft = Math.max(0, session.minutesTotal - minutesUsed);

    return {
      id: session.id,
      minutesTotal: session.minutesTotal,
      minutesUsed,
      minutesLeft,
      startedAt: session.startedAt,
      tariff: session.tariff
        ? { Title: session.tariff.Title, Price: session.tariff.Price }
        : null,
    };
  },

  async getQueue(userId: number) {
    const queue: any[] = await strapi.db.query('api::queue.queue').findMany({
      where: { status: 'waiting' },
      populate: ['user'],
      orderBy: { joinedAt: 'asc' },
    });

    const myIndex = queue.findIndex((q) => q.user?.id === userId);

    return {
      total: queue.length,
      myPosition: myIndex >= 0 ? myIndex + 1 : null,
      queue: queue.map((q, idx) => ({
        position: idx + 1,
        username: q.user?.username || 'Гость',
        joinedAt: q.joinedAt,
      })),
    };
  },
};
