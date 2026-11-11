import { factories } from '@strapi/strapi';

// Read-only: создание/изменение сессий только через /api/cloud/*
export default factories.createCoreController('api::session.session', ({ strapi }) => ({
  async create(ctx: any) {
    return ctx.forbidden('Создание сессий доступно только через /api/cloud/start-session');
  },
  async update(ctx: any) {
    return ctx.forbidden('Изменение сессий доступно только через /api/cloud/*');
  },
  async delete(ctx: any) {
    return ctx.forbidden('Удаление сессий запрещено');
  },
}));
