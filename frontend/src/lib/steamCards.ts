import { getJSON, setJSON } from './storage';

const CARDS_KEY = 'user_steam_cards';
const BADGES_KEY = 'user_crafted_badges';

export interface SteamCard {
  id: string;
  gameId: string;
  gameTitle: string;
  gameImage?: string;
  index: number;
}

export interface CraftedBadge {
  id: string;
  gameId: string;
  gameTitle: string;
  gameImage?: string;
  level: number;
  craftedDate: string;
}

export function getCards(): SteamCard[] {
  const raw = getJSON<any[]>(CARDS_KEY, []);
  const seen = new Set<string>();
  return raw
    .filter((c) => {
      if (!c || !c.id || !c.gameId || !c.gameTitle) return false;
      const key = `${c.gameId}_${c.index}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((c) => ({
      id: c.id,
      gameId: c.gameId,
      gameTitle: c.gameTitle,
      gameImage: c.gameImage || undefined,
      index: typeof c.index === 'number' ? c.index : 0,
    }));
}

export function getBadges(): CraftedBadge[] {
  const raw = getJSON<any[]>(BADGES_KEY, []);
  const valid = raw.filter((b) => b && b.id && b.gameId && b.gameTitle);

  // Дедупликация: один значок на игру. Оставляем самый ранний.
  const seen = new Set<string>();
  const deduped = valid.filter((b) => {
    const key = String(b.gameId);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Если были дубликаты — сохраняем очищенный список
  if (deduped.length !== valid.length) {
    setJSON(BADGES_KEY, deduped);
  }

  return deduped;
}

// Проверка: уже есть значок этой игры?
export function hasBadgeForGame(gameId: string): boolean {
  return getBadges().some((b) => String(b.gameId) === String(gameId));
}

export function grantCardsForGame(gameId: string, gameTitle: string, gameImage?: string): number {
  if (hasBadgeForGame(gameId)) return 0;

  const cards = getCards();
  const existing = cards.filter((c) => c.gameId === gameId);
  const existingIndices = existing.map((c) => c.index);
  const freeIndices = [0, 1, 2, 3, 4].filter((i) => !existingIndices.includes(i));

  const toGrant = Math.min(3, freeIndices.length);
  for (let i = 0; i < toGrant; i++) {
    const randIdx = freeIndices[Math.floor(Math.random() * freeIndices.length)];
    freeIndices.splice(freeIndices.indexOf(randIdx), 1);
    cards.push({
      id: `card_${Date.now()}_${randIdx}_${Math.random().toString(36).slice(2, 6)}`,
      gameId,
      gameTitle,
      gameImage,
      index: randIdx,
    });
  }
  setJSON(CARDS_KEY, cards);
  return toGrant;
}

export function getCraftableGames(): { gameId: string; gameTitle: string; gameImage?: string }[] {
  const cards = getCards();
  const byGame: Record<string, Set<number>> = {};
  const meta: Record<string, { title: string; image?: string }> = {};

  cards.forEach((c) => {
    if (!byGame[c.gameId]) byGame[c.gameId] = new Set();
    byGame[c.gameId].add(c.index);
    meta[c.gameId] = { title: c.gameTitle, image: c.gameImage };
  });

  return Object.keys(byGame)
    .filter((gameId) => byGame[gameId].size >= 5)
    .filter((gameId) => !hasBadgeForGame(gameId))
    .map((gameId) => ({ gameId, gameTitle: meta[gameId].title, gameImage: meta[gameId].image }));
}

export function craftBadge(gameId: string): boolean {
  if (hasBadgeForGame(gameId)) return false;

  const cards = getCards();
  const gameCards = cards.filter((c) => c.gameId === gameId);
  const uniqueIndices = new Set(gameCards.map((c) => c.index));
  if (uniqueIndices.size < 5) return false;

  const { gameTitle, gameImage } = gameCards[0];
  const newCards = cards.filter((c) => !(c.gameId === gameId && uniqueIndices.has(c.index)));
  setJSON(CARDS_KEY, newCards);

  const badges = getBadges();
  badges.push({
    id: `badge_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    gameId,
    gameTitle,
    gameImage,
    level: 1,
    craftedDate: new Date().toLocaleDateString('ru-RU'),
  });
  setJSON(BADGES_KEY, badges);
  return true;
}

export function pruneCards(libraryGameIds: string[]): number {
  const allowed = new Set(libraryGameIds.map(String));
  const cards = getCards();
  const filtered = cards.filter((c) => allowed.has(String(c.gameId)));
  if (filtered.length !== cards.length) setJSON(CARDS_KEY, filtered);
  return cards.length - filtered.length;
}
