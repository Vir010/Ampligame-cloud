'use strict';

export default {
  async topUp(ctx: any) {
    const { amount } = ctx.request.body;
    const userId = ctx.state?.user?.id || 1;

    if (!amount || amount <= 0) {
      return ctx.badRequest('Некорректная сумма');
    }

    // Добавляем деньги в наш виртуальный кошелек
    (global as any).mockBalances = (global as any).mockBalances || new Map();
    let currentBalance = (global as any).mockBalances.get(userId) || 5000;
    
    currentBalance += amount;
    (global as any).mockBalances.set(userId, currentBalance);

    console.log(`[Payment] Пользователь ${userId} пополнил баланс на ${amount} руб. Новый баланс: ${currentBalance}`);
    
    return { success: true, newBalance: currentBalance, message: `Баланс пополнен на ${amount} ₽` };
  }
};
