const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("jwt");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function apiRequest(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${STRAPI_URL}/api${path}`, { ...options, headers });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error?.message || `Ошибка ${res.status}`);
  }
  return json;
}

export async function startCloudSession(tariffId: string) {
  return apiRequest("/cloud/start-session", {
    method: "POST",
    body: JSON.stringify({ tariffId }),
  });
}

export async function stopCloudSession() {
  return apiRequest("/cloud/stop-session", { method: "POST" });
}

export async function getActiveSession() {
  return apiRequest("/cloud/active-session");
}

export async function getQueue() {
  return apiRequest("/cloud/queue");
}
