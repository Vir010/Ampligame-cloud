import { ACHIEVEMENTS_DEFINITIONS, AchievementState } from '@/data/achievements';
import { getJSON, setJSON, getItem } from './storage';
import { showToast } from './toast';

const ACH_KEY = 'user_achievements';
const POINTS_KEY = 'user_points';

export function getUserPoints(): number {
  return parseInt(getItem(POINTS_KEY) || '0');
}

export function addUserPoints(amount: number): void {
  const current = getUserPoints();
  setJSON(POINTS_KEY, current + amount);
}

export function checkAchievements(): void {
  const unlocked = getJSON<string[]>(ACH_KEY, []);
  const games = getJSON<any[]>('user_game_library', []);
  const reviews = getJSON<any[]>('user_reviews', []);
  const friends = getJSON<any[]>('user_friends', []);
  const cards = getJSON<any[]>('user_steam_cards', []);
  const craftedBadges = getJSON<any[]>('user_crafted_badges', []);
  
  let discountPurchases = 0;

  const state: AchievementState = {
    gamesCount: games.length,
    reviewsCount: reviews.length,
    friendsCount: friends.length,
    balance: parseInt(getItem('user_balance') || '0'),
    hasDescription: !!getItem('user_profile_description'),
    discountPurchases: discountPurchases,
    cardsCount: cards.length,
    craftedBadges: craftedBadges.length,
    completedSets: 0
  };

  let changed = false;
  ACHIEVEMENTS_DEFINITIONS.forEach((ach) => {
    if (!unlocked.includes(ach.id) && ach.condition(state)) {
      unlocked.push(ach.id);
      changed = true;
      showToast(`Достижение: "${ach.title}"`, 'success');
    }
  });

  if (changed) {
    setJSON(ACH_KEY, unlocked);
  }
}
