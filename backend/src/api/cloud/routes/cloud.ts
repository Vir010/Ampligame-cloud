export default {
  routes: [
    {
      method: 'POST',
      path: '/cloud/start-session',
      handler: 'cloud.startSession',
      config: { policies: [] },
    },
    {
      method: 'POST',
      path: '/cloud/stop-session',
      handler: 'cloud.stopSession',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/cloud/active-session',
      handler: 'cloud.activeSession',
      config: { policies: [] },
    },
    {
      method: 'GET',
      path: '/cloud/queue',
      handler: 'cloud.queue',
      config: { policies: [] },
    },
  ],
};
