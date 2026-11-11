/**
 * game controller.
 */

import { factories } from '@strapi/strapi';
import { walletService } from '../../../services/wallet';

export default factories.createCoreController('api::game.game', ({ strapi }) => ({
  async buy(ctx: any) {
    const user = ctx.state.user;
    const { id } = ctx.params;
    const { reference } = ctx.request.body ?? {};

    try {
      const result = await walletService.purchaseGame(strapi, {
        userId: user.id,
        gameId: String(id),
        reference: reference || `purchase_${user.id}_${id}_${Date.now()}`,
      });
      ctx.body = { data: result };
    } catch (err: any) {
      ctx.throw(400, err?.message || 'Ошибка покупки');
    }
  },

  async library(ctx: any) {
    const user = ctx.state.user;
    const data = await walletService.getLibrary(strapi, user.id, true);
    ctx.body = { data };
  },
}));
