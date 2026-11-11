export default {
  // Начать сессию
  async startSession(userId: number, tariffId: string) {
    // 1. Пользователь
    const user: any = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: userId },
    });
    if (!user) throw new Error('Пользователь не найден');

    // 2. Тариф
    const tariff: any = await strapi.db.query('api::tariff.tariff').findOne({
      where: { documentId: tariffId },
    });
    if (!tariff) throw new Error('Тариф не найден');

    // 3. Активная сессия?
    const activeSession: any = await strapi.db.query('api::session.session').findOne({
      where: { user: userId, status: 'active' },
    });
    if (activeSession) throw new Error('У вас уже есть активная сессия');

    // 4. Баланс
    const price = tariff.Price || 0;
    const balance = user.balance || 0;
    if (balance < price) {
      throw new Error(`Недостаточно средств. Нужно ${price - balance} ₽`);
    }

    // 5. Списываем
    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: userId },
      data: { balance: balance - price, activeTariff: tariff.id },
    });

    // 6. Создаём сессию (60 минут)
    const minutesTotal = 60;
    const now = new Date();

    const session: any = await strapi.db.query('api::session.session').create({
      data: {
        user: userId,
        tariff: tariff.id,
        startedAt: now.toISOString(),
        minutesUsed: 0,
        minutesTotal,
        status: 'active',
      },
    });

    // 7. Добавляем в очередь
    const queueCount = await strapi.db.query('api::queue.queue').count({
      where: { status: 'waiting' },
    });

    await strapi.db.query('api::queue.queue').create({
      data: {
        user: userId,
        position: queueCount + 1,
        joinedAt: now.toISOString(),
        status: 'waiting',
      },
    });

    return {
      session: {
        id: session.id,
        minutesTotal,
        minutesUsed: 0,
        startedAt: now.toISOString(),
        status: 'active',
      },
      tariff: { id: tariff.id, Title: tariff.Title, Price: tariff.Price },
      newBalance: balance - price,
    };
  },

  // Завершить сессию
  async stopSession(userId: number) {
    const session: any = await strapi.db.query('api::session.session').findOne({
      where: { user: userId, status: 'active' },
    });
    if (!session) throw new Error('Активная сессия не найдена');

    const now = new Date();
    const startedAt = new Date(session.startedAt);
    const minutesElapsed = Math.floor((now.getTime() - startedAt.getTime()) / 60000);

    await strapi.db.query('api::session.session').update({
      where: { id: session.id },
      data: {
        endedAt: now.toISOString(),
        minutesUsed: minutesElapsed,
        status: 'finished',
      },
    });

    await strapi.db.query('api::queue.queue').updateMany({
      where: { user: userId, status: { $in: ['waiting', 'playing'] } },
      data: { status: 'finished' },
    });

    return { minutesUsed: minutesElapsed, endedAt: now.toISOString() };
  },

  // Получить активную сессию
  async getActiveSession(userId: number) {
    const session: any = await strapi.db.query('api::session.session').findOne({
      where: { user: userId, status: 'active' },
      populate: ['tariff'],
    });
    if (!session) return null;

    const now = new Date();
    const startedAt = new Date(session.startedAt);
    const minutesElapsed = Math.floor((now.getTime() - startedAt.getTime()) / 60000);
    const minutesLeft = Math.max(0, session.minutesTotal - minutesElapsed);

    return {
      id: session.id,
      minutesTotal: session.minutesTotal,
      minutesUsed: minutesElapsed,
      minutesLeft,
      startedAt: session.startedAt,
      tariff: session.tariff
        ? { Title: session.tariff.Title, Price: session.tariff.Price }
        : null,
    };
  },

  // Получить очередь
  async getQueue(userId: number) {
    const queue: any[] = await strapi.db.query('api::queue.queue').findMany({
      where: { status: 'waiting' },
      populate: ['user'],
      orderBy: { position: 'asc' },
    });

    const myPosition = queue.findIndex((q) => q.user?.id === userId) + 1;

    return {
      total: queue.length,
      myPosition: myPosition > 0 ? myPosition : null,
      queue: queue.map((q, idx) => ({
        position: idx + 1,
        username: q.user?.username || 'Гость',
        joinedAt: q.joinedAt,
      })),
    };
  },
};
