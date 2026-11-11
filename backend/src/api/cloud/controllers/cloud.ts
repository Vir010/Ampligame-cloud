export default {
  async startSession(ctx: any) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized('Войдите в аккаунт');

      const { tariffId } = ctx.request.body;
      if (!tariffId) return ctx.badRequest('tariffId обязателен');

      const result = await strapi
        .service('api::cloud.cloud')
        .startSession(user.id, tariffId);
      return ctx.send(result);
    } catch (err: any) {
      return ctx.badRequest(err.message);
    }
  },

  async stopSession(ctx: any) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized('Войдите в аккаунт');

      const result = await strapi
        .service('api::cloud.cloud')
        .stopSession(user.id);
      return ctx.send(result);
    } catch (err: any) {
      return ctx.badRequest(err.message);
    }
  },

  async activeSession(ctx: any) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized('Войдите в аккаунт');

      const result = await strapi
        .service('api::cloud.cloud')
        .getActiveSession(user.id);
      return ctx.send({ session: result });
    } catch (err: any) {
      return ctx.badRequest(err.message);
    }
  },

  async queue(ctx: any) {
    try {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized('Войдите в аккаунт');

      const result = await strapi
        .service('api::cloud.cloud')
        .getQueue(user.id);
      return ctx.send(result);
    } catch (err: any) {
      return ctx.badRequest(err.message);
    }
  },
};
