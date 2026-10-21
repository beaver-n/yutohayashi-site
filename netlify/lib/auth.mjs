// 管理者のユーザー名とパスワードを確かめる(Netlifyの環境変数 ADMIN_USER / ADMIN_PASSWORD)
import { timingSafeEqual, createHash } from 'node:crypto';

function same(a, b) {
  const x = createHash('sha256').update(String(a)).digest();
  const y = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(x, y);
}

export function isAdmin(req) {
  const user = process.env.ADMIN_USER, pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass) return false;
  const h = req.headers.get('authorization') || '';
  if (!h.startsWith('Basic ')) return false;
  let decoded = '';
  try { decoded = Buffer.from(h.slice(6), 'base64').toString('utf8'); } catch { return false; }
  const i = decoded.indexOf(':');
  if (i < 0) return false;
  return same(decoded.slice(0, i), user) & same(decoded.slice(i + 1), pass) ? true : false;
}

export function denied() {
  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"', 'Cache-Control': 'no-store' }
  });
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}
