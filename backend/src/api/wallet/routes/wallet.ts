export default {
  routes: [
    { method: 'GET', path: '/wallets/transactions', handler: 'wallet.myTransactions', config: { auth: false } },
    { method: 'POST', path: '/wallets/reverse', handler: 'wallet.reverse', config: { auth: false } },
    { method: 'POST', path: '/wallets/admin-reverse', handler: 'wallet.adminReverse', config: { auth: false } },
  ],
};
