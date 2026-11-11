import { getJSON, setJSON, getItem, setItem, removeItem } from './storage';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  avatar: string;
}

const USERS_KEY = 'ampligame_users';
const CURRENT_USER_KEY = 'ampligame_current_user';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_ampligame_salt_v1');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getCurrentUser(): User | null {
  const raw = getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAllUsers(): User[] {
  return getJSON<User[]>(USERS_KEY, []);
}

export function saveAllUsers(users: User[]): void {
  setJSON(USERS_KEY, users);
}

export async function register(
  email: string,
  username: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  email = email.trim().toLowerCase();
  username = username.trim();

  if (email.length < 5 || !email.includes('@')) {
    return { success: false, error: 'Введите корректный email' };
  }
  if (username.length < 3) {
    return { success: false, error: 'Имя пользователя — минимум 3 символа' };
  }
  if (password.length < 6) {
    return { success: false, error: 'Пароль — минимум 6 символов' };
  }

  const users = getAllUsers();
  if (users.some((u) => u.email === email)) {
    return { success: false, error: 'Email уже зарегистрирован' };
  }
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { success: false, error: 'Имя пользователя занято' };
  }

  const passwordHash = await hashPassword(password);
  const user: User = {
    id: 'user_' + Date.now(),
    email,
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
    avatar: '/img/default-avatar.svg',
  };

  users.push(user);
  saveAllUsers(users);
  setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, user };
}

export async function login(
  identifier: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  identifier = identifier.trim();
  if (!identifier || !password) {
    return { success: false, error: 'Заполните все поля' };
  }

  const users = getAllUsers();
  const user = users.find(
    (u) =>
      u.email === identifier.toLowerCase() ||
      u.username.toLowerCase() === identifier.toLowerCase()
  );

  if (!user) {
    return { success: false, error: 'Пользователь не найден' };
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return { success: false, error: 'Неверный пароль' };
  }

  setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true, user };
}

export function logout(): void {
  removeItem(CURRENT_USER_KEY);
}
