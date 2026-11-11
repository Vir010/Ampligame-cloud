export default {
  routes: [
    { method: 'POST', path: '/payment/top-up', handler: 'payment.topUp', config: { auth: false } },
  ],
};
