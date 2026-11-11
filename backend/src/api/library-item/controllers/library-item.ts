/**
 * library-item controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::library-item.library-item', ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user;
    ctx.query = {
      ...ctx.query,
      filters: { ...(ctx.query?.filters ?? {}), wallet: { user: { id: user.id } } },
      populate: ctx.query?.populate ?? { game: true },
    };
    return super.find(ctx);
  },
}));
