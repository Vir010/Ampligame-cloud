/**
 * Мост к users-permissions: разбираем JWT и кладём пользователя в ctx.state.
 *
 * Маршруты кошелька объявлены с auth: false (чтобы не зависеть от состояния
 * таблицы up_permissions), поэтому пользователя разрешает этот middleware.
 */

import type { Core } from '@strapi/strapi';

export default (config: unknown, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: () => Promise<void>) => {
    const url = ctx.request.url.split('?')[0];
    if (!/^\/api\/wallets(\/|$)/.test(url) || ctx.state.user) return next();

    const header = ctx.request.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next();

    try {
      const service: any = strapi.plugin('users-permissions').service('jwt');
      const payload = await service.verify(token);
      const user = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: payload.id },
      });
      if (user) ctx.state.user = user;
    } catch (err: any) {
      strapi.log.debug(`[wallet] JWT: ${err?.message}`);
    }

    return next();
  };
};
