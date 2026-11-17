const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('jwt') || 'null'); } catch { return null; }
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${STRAPI_URL}/api${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || `Ошибка ${res.status}`);
  return json as T;
}

export interface LibraryGame {
  id: string;
  title: string;
  price: number;
  image: string | null;
  purchaseDate: string;
}

export function getLibrary() {
  return api<{ data: LibraryGame[] }>('/library');
}

export function buyGame(game: { id: string; title: string; price: number; image?: string | null }) {
  return api<{ success: boolean; game?: LibraryGame; newBalance: number; alreadyOwned?: boolean; library: LibraryGame[] }>(
    '/library/buy',
    { method: 'POST', body: JSON.stringify({ gameId: game.id, title: game.title, price: game.price, image: game.image }) }
  );
}

// НОВОЕ: покупка карточек
export function buyCards(opts: { count: number; pricePerCard: number }) {
  return api<{ success: boolean; newBalance: number; total: number; count: number }>(
    '/library/buy-cards',
    { method: 'POST', body: JSON.stringify(opts) }
  );
}

export function removeFromLibrary(gameId: string) {
  return api<{ success: boolean; library: LibraryGame[] }>(
    `/library/remove/${encodeURIComponent(gameId)}`,
    { method: 'DELETE' }
  );
}
