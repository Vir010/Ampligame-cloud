const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

export interface ActiveSession {
  id: number; minutesTotal: number; minutesUsed: number; minutesLeft: number; startedAt: string;
  tariff: { Title: string; Price: number } | null;
}
export interface QueueItem { position: number; username: string; joinedAt: string; }
export interface QueueData { total: number; myPosition: number | null; queue: QueueItem[]; }

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('jwt') || 'null'); } catch { return null; }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${STRAPI_URL}/api${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || `Ошибка ${res.status}`);
  return json as T;
}

// Обновленная функция — теперь принимает объект тарифа целиком
export function startCloudSession(tariff: any) {
  return apiRequest<{ session: any; tariff: any; newBalance: number }>('/cloud/start-session', {
    method: 'POST',
    body: JSON.stringify({ 
      tariffId: tariff.documentId, 
      title: tariff.Title, 
      price: tariff.Price 
    }),
  });
}

export function stopCloudSession() {
  return apiRequest<{ refund: number; newBalance: number }>('/cloud/stop-session', { method: 'POST' });
}
export function getActiveSession() {
  return apiRequest<{ session: ActiveSession | null }>('/cloud/active-session');
}
export function getQueue() {
  return apiRequest<QueueData>('/cloud/queue');
}
export function topUpBalance(amount: number) {
  return apiRequest<{ success: boolean; newBalance: number; message: string }>('/payment/top-up', {
    method: 'POST', body: JSON.stringify({ amount }),
  });
}
// Новая функция получения баланса
export function getBalance() {
  return apiRequest<{ balance: number }>('/cloud/balance');
}
