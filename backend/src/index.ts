import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    try {
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' },
      });

      let usera = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: 'usera@test.com' },
      });
      if (!usera) {
        usera = await strapi.plugins['users-permissions'].services.user.add({
          username: 'usera',
          email: 'usera@test.com',
          password: 'Passw0rd!',
          provider: 'local',
          confirmed: true,
          blocked: false,
          role: role ? role.id : null,
        });
      }

      let userb = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: 'userb@test.com' },
      });
      if (!userb) {
        userb = await strapi.plugins['users-permissions'].services.user.add({
          username: 'userb',
          email: 'userb@test.com',
          password: 'Passw0rd!',
          provider: 'local',
          confirmed: true,
          blocked: false,
          role: role ? role.id : null,
        });
      }

      const existingTxCount = await strapi.db.query('api::wallet.transaction').count({
        where: { status: 'success', type: 'purchase' },
      });

      if (existingTxCount < 2) {
        await strapi.db.query('api::wallet.transaction').deleteMany({});

        const txA = await strapi.db.query('api::wallet.transaction').create({
          data: { amount: 100, type: 'purchase', status: 'success', user: usera.id },
        });
        const txB = await strapi.db.query('api::wallet.transaction').create({
          data: { amount: 200, type: 'purchase', status: 'success', user: userb.id },
        });

        console.log(`✅ Тестовые транзакции созданы: txA.id=${txA.id} (usera), txB.id=${txB.id} (userb)`);
      }
    } catch (e) {
      console.error('❌ Ошибка при засеивании базы:', e);
    }
  },
};
