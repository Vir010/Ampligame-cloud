const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

export interface ActiveSession {
  id: number;
  minutesTotal: number;
  minutesUsed: number;
  minutesLeft: number;
  startedAt: string;
  tariff: { Title: string; Price: number } | null;
}

export interface QueueItem { position: number; username: string; joinedAt: string; }
export interface QueueData { total: number; myPosition: number | null; queue: QueueItem[]; }
export interface StartSessionResult {
  session: { id: number; minutesTotal: number; minutesUsed: number; startedAt: string; status: 'active'; };
  tariff: { id: string; Title: string; Price: number };
  newBalance: number;
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('jwt') || 'null'); } catch { return null; }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, { ...options, headers });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error?.message || `Ошибка ${res.status}`);
    return json as T;
  } catch (err: any) {
    throw new Error(err.message || 'Ошибка сети');
  }
}

export function startCloudSession(tariffId: string) {
  return apiRequest<StartSessionResult>('/cloud/start-session', { method: 'POST', body: JSON.stringify({ tariffId }) });
}
export function stopCloudSession() {
  return apiRequest<any>('/cloud/stop-session', { method: 'POST' });
}
export function getActiveSession() {
  return apiRequest<{ session: ActiveSession | null }>('/cloud/active-session');
}
export function getQueue() {
  return apiRequest<QueueData>('/cloud/queue');
}

// НОВОЕ: Запрос к серверу на пополнение баланса
export async function topUpBalance(amount: number) {
  return apiRequest<{ success: boolean; newBalance: number; message: string }>('/payment/top-up', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}
