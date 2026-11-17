'use strict';

(global as any).mockBalances = (global as any).mockBalances || new Map();
(global as any).activeSessions = (global as any).activeSessions || new Map();

export default {
  async startSession(ctx: any) {
    const { tariffId, title, price } = ctx.request.body;
    const userId = ctx.state?.user?.id || 1; 
    
    const tariffPrice = Number(price) || 1000;
    const tariffName = title || 'Тариф';

    let currentBalance = (global as any).mockBalances.get(userId) || 5000;

    if (currentBalance < tariffPrice) {
      return ctx.badRequest('Недостаточно средств на балансе');
    }

    currentBalance -= tariffPrice;
    (global as any).mockBalances.set(userId, currentBalance);

    const session = {
      id: Date.now(),
      userId,
      tariff: { Title: tariffName, Price: tariffPrice },
      minutesTotal: 60,
      minutesUsed: 0,
      startedAt: new Date().toISOString(),
      status: 'active'
    };
    
    (global as any).activeSessions.set(userId, session);
    
    return { session, tariff: session.tariff, newBalance: currentBalance };
  },

  async stopSession(ctx: any) {
    const userId = ctx.state?.user?.id || 1;
    const session = (global as any).activeSessions.get(userId);
    
    if (session) {
      const refundAmount = 500; 
      let currentBalance = (global as any).mockBalances.get(userId) || 0;
      currentBalance += refundAmount;
      (global as any).mockBalances.set(userId, currentBalance);
      (global as any).activeSessions.delete(userId);
      
      return { minutesUsed: 15, minutesLeft: 45, refund: refundAmount, newBalance: currentBalance, endedAt: new Date().toISOString() };
    }
    
    return { minutesUsed: 0, minutesLeft: 0, refund: 0, newBalance: (global as any).mockBalances.get(userId) || 5000, endedAt: new Date().toISOString() };
  },

  async getActiveSession(ctx: any) {
    const userId = ctx.state?.user?.id || 1;
    const session = (global as any).activeSessions.get(userId);
    if (!session) return { session: null };

    const now = new Date();
    const start = new Date(session.startedAt);
    const diffMinutes = Math.floor((now.getTime() - start.getTime()) / 60000);
    
    return {
      session: {
        ...session,
        minutesUsed: diffMinutes,
        minutesLeft: Math.max(0, session.minutesTotal - diffMinutes)
      }
    };
  },

  async getQueue(ctx: any) {
    return {
      total: 2,
      myPosition: 3,
      queue: [
        { position: 1, username: 'PlayerOne', joinedAt: new Date().toISOString() },
        { position: 2, username: 'ShadowMaster', joinedAt: new Date().toISOString() }
      ]
    };
  },

  // НОВЫЙ ЭНДПОИНТ: Отдает текущий баланс пользователя
  async getBalance(ctx: any) {
    const userId = ctx.state?.user?.id || 1;
    const balance = (global as any).mockBalances.get(userId) || 5000; // По умолчанию 5000
    return { balance };
  }
};
