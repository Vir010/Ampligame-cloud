/**
 * Клиент денежного API (кошелёк, транзакции, библиотека).
 *
 * Запросы идут через серверный прокси Next.js (/api/wallet/*), который
 * проверяет JWT и пробрасывает их в Strapi. Вся денежная логика и защита
 * от двойного списания — на бэкенде (backend/src/services/wallet.ts).
 */

const TOKEN_KEY = "ampligame_jwt";

export interface WalletTransaction {
  id: number;
  documentId?: string;
  type: "deposit" | "withdraw" | "purchase" | "refund";
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  status: "pending" | "completed" | "failed" | "reversed";
  reference: string;
  createdAt: string;
}

export interface Wallet {
  id: number;
  documentId?: string;
  balance: number;
  currency: string;
  transactions?: WalletTransaction[];
}

export interface LibraryItem {
  id: number;
  documentId?: string;
  status: "owned" | "installed" | "refunded";
  pricePaid: number;
  purchasedAt: string;
  game?: {
    id: number;
    documentId?: string;
    Title?: string;
    Price?: number;
  };
}

export class WalletError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  if (!token) throw new WalletError("Требуется авторизация", 401);

  const res = await fetch(`/api/wallet${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      json?.error?.message ||
      json?.message ||
      (res.status === 401 ? "Сессия истекла, войдите заново" : "Ошибка запроса");
    throw new WalletError(message, res.status);
  }
  return json.data as T;
}

export async function fetchWallet(): Promise<Wallet> {
  return request<Wallet>("/wallets/me");
}

export async function deposit(amount: number, reference?: string): Promise<Wallet> {
  return request<Wallet>("/wallets/deposit", {
    method: "POST",
    body: JSON.stringify({ amount, reference }),
  });
}

export async function withdraw(amount: number, reference?: string): Promise<Wallet> {
  return request<Wallet>("/wallets/withdraw", {
    method: "POST",
    body: JSON.stringify({ amount, reference }),
  });
}

export async function purchaseGame(
  gameId: string | number,
  reference?: string
): Promise<{ balance: number; walletId: number; game?: any; libraryItem?: LibraryItem }> {
  return request("/wallets/purchase", {
    method: "POST",
    body: JSON.stringify({ gameId, reference }),
  });
}

export async function fetchLibrary(): Promise<LibraryItem[]> {
  return request<LibraryItem[]>("/wallets/library");
}

export async function fetchTransactions(): Promise<WalletTransaction[]> {
  const wallet = await fetchWallet();
  return wallet.transactions ?? [];
}

/** Детерминированный ключ идемпотентности покупки. */
export function purchaseReference(userId: string, gameId: string | number): string {
  return `purchase_${userId}_${gameId}`;
}
