/**
 * transaction controller — только чтение, запись идёт через сервис кошелька.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::transaction.transaction', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    ctx.query = {
      ...ctx.query,
      filters: { ...(ctx.query?.filters ?? {}), wallet: { user: { id: user.id } } },
      sort: ctx.query?.sort ?? 'createdAt:desc',
    };
    return super.find(ctx);
  },
}));
