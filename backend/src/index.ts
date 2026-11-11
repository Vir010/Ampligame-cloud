import type { Core } from '@strapi/strapi';
import { runWalletMigration } from './migrations/wallet-constraints';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await runWalletMigration(strapi);
  },
};
