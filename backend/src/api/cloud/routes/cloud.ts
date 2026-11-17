export default {
  routes: [
    { method: 'POST', path: '/cloud/start-session', handler: 'cloud.startSession', config: { auth: false } },
    { method: 'POST', path: '/cloud/stop-session', handler: 'cloud.stopSession', config: { auth: false } },
    { method: 'GET', path: '/cloud/active-session', handler: 'cloud.getActiveSession', config: { auth: false } },
    { method: 'GET', path: '/cloud/queue', handler: 'cloud.getQueue', config: { auth: false } },
    { method: 'GET', path: '/cloud/balance', handler: 'cloud.getBalance', config: { auth: false } },
  ],
};
