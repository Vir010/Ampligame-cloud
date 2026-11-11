/**
 * wallet service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::wallet.wallet', ({ strapi }) => ({
  ensureWallet: (userId: number | string) =>
    import('../../../services/wallet').then((m) => m.walletService.ensureWallet(strapi, userId)),
  deposit: (args: any) =>
    import('../../../services/wallet').then((m) => m.walletService.deposit(strapi, args)),
  withdraw: (args: any) =>
    import('../../../services/wallet').then((m) => m.walletService.withdraw(strapi, args)),
  purchaseGame: (args: any) =>
    import('../../../services/wallet').then((m) => m.walletService.purchaseGame(strapi, args)),
  reverseTransaction: (reference: string) =>
    import('../../../services/wallet').then((m) => m.walletService.reverseTransaction(strapi, reference)),
  getLibrary: (userId: number | string, includeGame?: boolean) =>
    import('../../../services/wallet').then((m) =>
      m.walletService.getLibrary(strapi, userId, includeGame)
    ),
}));
