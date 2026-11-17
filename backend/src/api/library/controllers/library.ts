'use strict';

(global as any).userLibraries = (global as any).userLibraries || new Map();
(global as any).mockBalances  = (global as any).mockBalances  || new Map();

function getUserId(ctx: any) {
  return ctx.state?.user?.id || 1;
}

export default {
  async getLibrary(ctx: any) {
    const userId = getUserId(ctx);
    const library = (global as any).userLibraries.get(userId) || [];
    return { data: library };
  },

  async buy(ctx: any) {
    const userId = getUserId(ctx);
    const { gameId, title, price, image } = ctx.request.body;
    if (!gameId || !title) return ctx.badRequest('Не переданы gameId или title');

    const cost = Number(price) || 0;
    let balance = (global as any).mockBalances.get(userId) ?? 5000;
    if (balance < cost) return ctx.badRequest('Недостаточно средств на балансе');

    balance -= cost;
    (global as any).mockBalances.set(userId, balance);

    const library = (global as any).userLibraries.get(userId) || [];
    const alreadyOwned = library.some((g: any) => String(g.id) === String(gameId));

    if (!alreadyOwned) {
      library.push({
        id: String(gameId), title, price: cost,
        image: image || null,
        purchaseDate: new Date().toLocaleDateString('ru-RU'),
      });
      (global as any).userLibraries.set(userId, library);
    }

    return { success: true, alreadyOwned, newBalance: balance, library };
  },

  // НОВЫЙ: покупка карточек (дешево)
  async buyCards(ctx: any) {
    const userId = getUserId(ctx);
    const { count, pricePerCard } = ctx.request.body;

    const qty = Math.max(1, Math.min(10, Number(count) || 1));
    const unit = Math.max(1, Number(pricePerCard) || 50);
    const total = qty * unit;

    let balance = (global as any).mockBalances.get(userId) ?? 5000;
    if (balance < total) return ctx.badRequest('Недостаточно средств на балансе');

    balance -= total;
    (global as any).mockBalances.set(userId, balance);

    return { success: true, newBalance: balance, total, count: qty };
  },

  async remove(ctx: any) {
    const userId = getUserId(ctx);
    const gameId = String(ctx.params.gameId);
    const library = (global as any).userLibraries.get(userId) || [];
    const filtered = library.filter((g: any) => String(g.id) !== gameId);
    (global as any).userLibraries.set(userId, filtered);
    return { success: true, library: filtered };
  },
};
