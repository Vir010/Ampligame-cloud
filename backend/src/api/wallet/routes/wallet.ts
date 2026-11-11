/**
 * wallet router — публичные маршруты (авторизация проверяется
 * в контроллере через ctx.state.user и middleware global::wallet-auth).
 * auth: false отключает политику users-permissions: состояние up_permissions
 * не влияет на работу денежного API.
 */

const base = { auth: false };

export default {
  routes: [
    { method: 'GET', path: '/wallets/me', handler: 'wallet.me', config: base },
    { method: 'GET', path: '/wallets/library', handler: 'wallet.library', config: base },
    { method: 'POST', path: '/wallets/deposit', handler: 'wallet.deposit', config: base },
    { method: 'POST', path: '/wallets/withdraw', handler: 'wallet.withdraw', config: base },
    { method: 'POST', path: '/wallets/purchase', handler: 'wallet.purchase', config: base },
    { method: 'POST', path: '/wallets/reverse', handler: 'wallet.reverse', config: base },
  ],
};
