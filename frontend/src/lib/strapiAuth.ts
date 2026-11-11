/**
 * Синхронизация локального пользователя Ampligame с пользователем Strapi.
 *
 * Strapi выдаёт JWT, которым подписываются запросы к денежному API.
 * Токен хранится в localStorage и удаляется при выходе.
 */

import { setToken } from './wallet';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

interface StrapiAuthResponse {
  jwt?: string;
  user?: { id: number; email: string; username: string };
  error?: { message?: string };
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return (await res.json().catch(() => ({}))) as T;
}

/**
 * Регистрирует пользователя в Strapi (если он ещё не создан) и сохраняет JWT.
 * Ошибки не пробрасываются: приложение продолжает работать без сервера.
 */
export async function syncStrapiAuth(
  username: string,
  email: string,
  password: string,
  mode: 'register' | 'login' = 'register'
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (mode === 'login') {
      const result = await post<StrapiAuthResponse>('/auth/local', { identifier: email, password });
      if (result.jwt) {
        setToken(result.jwt);
        return { ok: true };
      }
      return { ok: false, error: result.error?.message || 'Strapi: вход не выполнен' };
    }

    let result = await post<StrapiAuthResponse>('/auth/local/register', {
      username,
      email,
      password,
    });

    if (!result.jwt) {
      // Пользователь уже есть в Strapi — пробуем войти.
      result = await post<StrapiAuthResponse>('/auth/local', { identifier: email, password });
    }

    if (result.jwt) {
      setToken(result.jwt);
      return { ok: true };
    }
    return { ok: false, error: result.error?.message || 'Strapi: регистрация не удалась' };
  } catch (err: any) {
    return { ok: false, error: err?.message ?? 'Strapi недоступен' };
  }
}

export function clearStrapiAuth(): void {
  setToken(null);
}
