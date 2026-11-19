export default ({ env }: { env: any }) => ({
  'users-permissions': {
    config: {
      ratelimit: {
        enabled: true,
        interval: 60 * 1000,
        max: 10,
      },
    },
  },
});
