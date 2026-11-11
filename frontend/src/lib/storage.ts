// src/lib/storage.ts
// Per-user изоляция localStorage (перенос из storage.js)

const GLOBAL_KEYS = ['ampligame_current_user', 'ampligame_users', 'app_theme', 'app_language'];
const PER_USER_KEYS = [
  'user_nickname', 'user_avatar', 'user_display_name', 'user_balance',
  'user_game_library', 'user_achievements', 'user_friends',
  'friend_requests', 'blocked_users',
];
const PER_USER_PREFIXES = ['game_installed_'];

function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('ampligame_current_user');
    return raw ? JSON.parse(raw).id : null;
  } catch {
    return null;
  }
}

function isPerUserKey(key: string): boolean {
  if (PER_USER_KEYS.includes(key)) return true;
  for (const prefix of PER_USER_PREFIXES) {
    if (key.startsWith(prefix)) return true;
  }
  return false;
}

function resolveKey(key: string): string {
  if (GLOBAL_KEYS.includes(key)) return key;
  if (!isPerUserKey(key)) return key;
  const userId = getUserId();
  if (!userId) return key;
  return `${key}__${userId}`;
}

export function getItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(resolveKey(key));
}

export function setItem(key: string, value: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(resolveKey(key), value);
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(resolveKey(key));
}

export function getJSON<T = any>(key: string, fallback: T): T {
  const raw = getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON(key: string, value: any): void {
  setItem(key, JSON.stringify(value));
}

// Очистка legacy-данных (при регистрации нового пользователя)
export function clearLegacy(): void {
  if (typeof window === 'undefined') return;
  PER_USER_KEYS.forEach((k) => {
    localStorage.removeItem(k);
  });
  PER_USER_PREFIXES.forEach((p) => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(p) && !k.includes('__')) {
        localStorage.removeItem(k);
      }
    }
  });
}
