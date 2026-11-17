'use strict';

// Глобальное хранилище (в проде — БД Strapi)
(global as any).userLibraries = (global as any).userLibraries || new Map();
(global as any).mockBalances  = (global as any).mockBalances  || new Map();

function getUserId(ctx: any) {
  return ctx.state?.user?.id || 1;
}

export default {
  // GET /api/library — список купленных игр текущего пользователя
  async getLibrary(ctx: any) {
    const userId = getUserId(ctx);
    const library = (global as any).userLibraries.get(userId) || [];
    return { data: library };
  },

  // POST /api/library/buy — покупка игры
  async buy(ctx: any) {
    const userId = getUserId(ctx);
    const { gameId, title, price, image } = ctx.request.body;

    if (!gameId || !title) {
      return ctx.badRequest('Не переданы gameId или title');
    }

    const cost = Number(price) || 0;
    let balance = (global as any).mockBalances.get(userId) ?? 5000;

    if (balance < cost) {
      return ctx.badRequest('Недостаточно средств на балансе');
    }

    // Проверяем, не куплена ли уже
    const library = (global as any).userLibraries.get(userId) || [];
    if (library.some((g: any) => String(g.id) === String(gameId))) {
      return { success: true, alreadyOwned: true, newBalance: balance, library };
    }

    balance -= cost;
    (global as any).mockBalances.set(userId, balance);

    const newGame = {
      id: String(gameId),
      title,
      price: cost,
      image: image || null,
      purchaseDate: new Date().toLocaleDateString('ru-RU'),
    };

    library.push(newGame);
    (global as any).userLibraries.set(userId, library);

    return { success: true, game: newGame, newBalance: balance, library };
  },

  // DELETE /api/library/remove/:gameId — удаление из библиотеки
  async remove(ctx: any) {
    const userId = getUserId(ctx);
    const gameId = String(ctx.params.gameId);

    const library = (global as any).userLibraries.get(userId) || [];
    const filtered = library.filter((g: any) => String(g.id) !== gameId);

    (global as any).userLibraries.set(userId, filtered);

    return { success: true, library: filtered };
  },
};
