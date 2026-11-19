import ratelimit from 'koa-ratelimit';

const db = new Map();

export default () => {
  const authLimiter = ratelimit({
    driver: 'memory',
    db,
    duration: 60 * 1000,
    max: 10,
    id: (ctx: any) => `auth:${ctx.ip}`,
    errorMessage: 'Слишком много попыток авторизации. Повторите позже.',
    disableHeader: false,
  });

  const walletLimiter = ratelimit({
    driver: 'memory',
    db,
    duration: 60 * 1000,
    max: 20,
    id: (ctx: any) => `wallet:${ctx.ip}`,
    errorMessage: 'Слишком много запросов к кошельку. Повторите позже.',
    disableHeader: false,
  });

  return async (ctx: any, next: () => Promise<any>) => {
    if (ctx.path.startsWith('/api/auth/')) {
      return authLimiter(ctx, next);
    }
    if (ctx.path.startsWith('/api/wallets/')) {
      return walletLimiter(ctx, next);
    }
    return next();
  };
};
