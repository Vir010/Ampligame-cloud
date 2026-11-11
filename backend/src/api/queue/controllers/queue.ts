import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::queue.queue', ({ strapi }) => ({
  async create(ctx: any) {
    return ctx.forbidden('Очередь управляется через /api/cloud/start-session');
  },
  async update(ctx: any) {
    return ctx.forbidden('Очередь управляется через /api/cloud/*');
  },
  async delete(ctx: any) {
    return ctx.forbidden('Удаление из очереди доступно через /api/cloud/stop-session');
  },
}));
