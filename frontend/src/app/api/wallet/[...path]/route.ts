/**
 * Серверный прокси денежного API Strapi.
 *
 * Браузер → /api/wallet/wallets/* → Strapi /api/wallets/*.
 * JWT пользователя проверяется в Strapi; в ответ 401 добавляется понятное
 * сообщение. Вся денежная логика и защита от двойного списания — на бэкенде.
 */

import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL =
  process.env.STRAPI_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  'http://127.0.0.1:1337';

type Ctx = { params: Promise<{ path?: string[] }> };

function getToken(req: NextRequest): string | null {
  const header = req.headers.get('authorization') || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return req.cookies.get('jwt')?.value ?? null;
}

async function proxy(req: NextRequest, resource: string, ctx: Ctx) {
  const token = getToken(req);
  if (!token) {
    return NextResponse.json(
      { error: { message: 'Требуется авторизация', status: 401 } },
      { status: 401 }
    );
  }

  const { path = [] } = await ctx.params;
  const query = req.nextUrl.search || '';
  // Защита от двойного префикса: /api/wallet/wallets/me → /wallets/me
  const resourcePath = path[0] === resource ? path.slice(1) : path;
  const target = `${STRAPI_URL}/api/${resource}${resourcePath.length ? '/' + resourcePath.join('/') : ''}${query}`;

  const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.text();

  try {
    const res = await fetch(target, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body || undefined,
      cache: 'no-store',
    });

    const json = await res.json().catch(() => ({ error: { message: 'Пустой ответ Strapi' } }));

    if (res.status === 401) {
      return NextResponse.json(
        { error: { message: 'Сессия истекла, войдите заново', status: 401 } },
        { status: 401 }
      );
    }

    return NextResponse.json(json, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: { message: `Strapi недоступен: ${err?.message ?? err}`, status: 502 } },
      { status: 502 }
    );
  }
}

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, 'wallets', ctx);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, 'wallets', ctx);
}
