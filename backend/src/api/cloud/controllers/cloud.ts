'use strict';

export default {
  async startSession(ctx: any) {
    const { tariffId } = ctx.request.body;
    const userId = ctx.state?.user?.id || 1;

    const session = {
      id: Date.now(),
      userId,
      tariff: { Title: 'Премиум', Price: 3599 },
      minutesTotal: 60,
      minutesUsed: 0,
      startedAt: new Date().toISOString(),
      status: 'active'
    };
    
    // Глобальная переменная (для теста)
    (global as any).activeSessions = (global as any).activeSessions || new Map();
    (global as any).activeSessions.set(userId, session);
    
    return { session, tariff: session.tariff, newBalance: 5000 };
  },

  async stopSession(ctx: any) {
    const userId = ctx.state?.user?.id || 1;
    if ((global as any).activeSessions) {
      (global as any).activeSessions.delete(userId);
    }
    return { minutesUsed: 15, minutesLeft: 45, refund: 100, endedAt: new Date().toISOString() };
  },

  async getActiveSession(ctx: any) {
    const userId = ctx.state?.user?.id || 1;
    const session = (global as any).activeSessions?.get(userId);
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
  }
};
