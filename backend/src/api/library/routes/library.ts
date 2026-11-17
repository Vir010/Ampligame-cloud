export default {
  routes: [
    { method: 'GET',    path: '/library',                handler: 'library.getLibrary', config: { auth: false } },
    { method: 'POST',   path: '/library/buy',            handler: 'library.buy',       config: { auth: false } },
    { method: 'POST',   path: '/library/buy-cards',      handler: 'library.buyCards',  config: { auth: false } },
    { method: 'DELETE', path: '/library/remove/:gameId', handler: 'library.remove',    config: { auth: false } },
  ],
};
