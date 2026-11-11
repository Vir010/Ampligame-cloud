'use strict';

export default {
  async topUp(ctx: any) {
    const { amount } = ctx.request.body;
    if (!amount || amount <= 0) return ctx.badRequest('Некорректная сумма');
    console.log(`[Payment] Успешно пополнено на ${amount} руб.`);
    return { success: true, newBalance: amount, message: `Баланс пополнен на ${amount} ₽` };
  }
};
