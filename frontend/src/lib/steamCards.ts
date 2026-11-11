import { getJSON, setJSON } from './storage';

const CARDS_KEY = 'user_steam_cards';
const BADGES_KEY = 'user_crafted_badges';

export interface SteamCard {
  id: string;
  gameId: string;
  gameTitle: string;
  index: number;
}

export interface CraftedBadge {
  id: string;
  gameId: string;
  gameTitle: string;
  level: number;
  craftedDate: string;
}

export function getCards(): SteamCard[] {
  const raw = getJSON<any[]>(CARDS_KEY, []);
  // Фильтруем битые карточки и дедуплицируем по (gameId + index)
  const seen = new Set<string>();
  return raw.filter(c => {
    if (!c || !c.id || !c.gameId || !c.gameTitle) return false;
    const key = `${c.gameId}_${c.index}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(c => ({
    id: c.id,
    gameId: c.gameId,
    gameTitle: c.gameTitle,
    index: typeof c.index === 'number' ? c.index : 0
  }));
}

export function getBadges(): CraftedBadge[] {
  const raw = getJSON<any[]>(BADGES_KEY, []);
  return raw.filter(b => b && b.id && b.gameId && b.gameTitle);
}

export function grantCardsForGame(gameId: string, gameTitle: string): number {
  const cards = getCards();
  const existing = cards.filter(c => c.gameId === gameId);
  const existingIndices = existing.map(c => c.index);
  const freeIndices = [0, 1, 2, 3, 4].filter(i => !existingIndices.includes(i));

  const toGrant = Math.min(3, freeIndices.length);
  for (let i = 0; i < toGrant; i++) {
    const randIdx = freeIndices[Math.floor(Math.random() * freeIndices.length)];
    freeIndices.splice(freeIndices.indexOf(randIdx), 1);
    cards.push({
      id: `card_${Date.now()}_${randIdx}_${Math.random().toString(36).slice(2, 6)}`,
      gameId,
      gameTitle,
      index: randIdx
    });
  }
  setJSON(CARDS_KEY, cards);
  return toGrant;
}

export function getCraftableGames(): { gameId: string; gameTitle: string }[] {
  const cards = getCards();
  const byGame: Record<string, Set<number>> = {};
  const titles: Record<string, string> = {};

  cards.forEach(c => {
    if (!byGame[c.gameId]) byGame[c.gameId] = new Set();
    byGame[c.gameId].add(c.index);
    titles[c.gameId] = c.gameTitle;
  });

  return Object.keys(byGame)
    .filter(gameId => byGame[gameId].size >= 5)
    .map(gameId => ({ gameId, gameTitle: titles[gameId] }));
}

export function craftBadge(gameId: string): boolean {
  const cards = getCards();
  const gameCards = cards.filter(c => c.gameId === gameId);
  const uniqueIndices = new Set(gameCards.map(c => c.index));

  if (uniqueIndices.size < 5) return false;

  const gameTitle = gameCards[0].gameTitle;
  const newCards = cards.filter(c => !(c.gameId === gameId && uniqueIndices.has(c.index)));
  setJSON(CARDS_KEY, newCards);

  const badges = getBadges();
  badges.push({
    id: `badge_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    gameId,
    gameTitle,
    level: 1,
    craftedDate: new Date().toLocaleDateString('ru-RU')
  });
  setJSON(BADGES_KEY, badges);
  return true;
}
