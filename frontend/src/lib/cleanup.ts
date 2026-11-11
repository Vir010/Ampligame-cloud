// Одноразовая очистка битых данных в localStorage
export function cleanupStorage() {
  if (typeof window === 'undefined') return;

  const CLEANUP_KEY = 'ampligame_cleanup_v1';
  if (localStorage.getItem(CLEANUP_KEY) === '1') return;

  try {
    // 1. Чистим библиотеку (удаляем дубликаты)
    const library = JSON.parse(localStorage.getItem('user_game_library') || '[]');
    if (Array.isArray(library)) {
      const seen = new Set();
      const unique = library.filter((g: any) => {
        if (!g || !g.id || seen.has(g.id)) return false;
        seen.add(g.id);
        return true;
      });
      localStorage.setItem('user_game_library', JSON.stringify(unique));
    }

    // 2. Чистим wishlist
    const wishlist = JSON.parse(localStorage.getItem('user_wishlist') || '[]');
    if (Array.isArray(wishlist)) {
      const unique = [...new Set(wishlist.filter((id): id is string => typeof id === 'string'))];
      localStorage.setItem('user_wishlist', JSON.stringify(unique));
    }

    // 3. Чистим steam_cards (только валидные)
    const cards = JSON.parse(localStorage.getItem('user_steam_cards') || '[]');
    if (Array.isArray(cards)) {
      const valid = cards.filter((c: any) => c && c.id && c.gameId && c.gameTitle);
      localStorage.setItem('user_steam_cards', JSON.stringify(valid));
    }

    // 4. Чистим badges
    const badges = JSON.parse(localStorage.getItem('user_crafted_badges') || '[]');
    if (Array.isArray(badges)) {
      const valid = badges.filter((b: any) => b && b.id && b.gameId && b.gameTitle);
      localStorage.setItem('user_crafted_badges', JSON.stringify(valid));
    }

    localStorage.setItem(CLEANUP_KEY, '1');
    console.log('[Cleanup] localStorage cleaned');
  } catch (e) {
    console.error('[Cleanup] Error:', e);
  }
}
