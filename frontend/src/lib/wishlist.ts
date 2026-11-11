import { getJSON, setJSON } from './storage';

const WISHLIST_KEY = 'user_wishlist';

export function getWishlist(): string[] {
  const raw = getJSON<string[]>(WISHLIST_KEY, []);
  // Дедуплицируем и фильтруем мусор
  return [...new Set(raw)].filter((id): id is string => typeof id === 'string' && id.length > 0);
}

export function toggleWishlist(gameId: string): boolean {
  const list = getWishlist();
  const index = list.indexOf(gameId);
  let added = false;

  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push(gameId);
    added = true;
  }

  setJSON(WISHLIST_KEY, list);
  return added;
}

export function isInWishlist(gameId: string): boolean {
  return getWishlist().includes(gameId);
}
