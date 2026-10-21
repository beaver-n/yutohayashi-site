// 管理サイト(/admin)を開く前に、ブラウザ標準のパスワード画面を出す
function same(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
function decodeBasic(h) {
  const bin = atob(h.slice(6));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default async (request, context) => {
  const user = Netlify.env.get('ADMIN_USER');
  const pass = Netlify.env.get('ADMIN_PASSWORD');
  if (!user || !pass) {
    return new Response('管理者のユーザー名とパスワードが、まだNetlifyに設定されていません。', {
      status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }
  const h = request.headers.get('authorization') || '';
  if (h.startsWith('Basic ')) {
    try {
      const d = decodeBasic(h);
      const i = d.indexOf(':');
      if (i >= 0 && same(d.slice(0, i), user) & same(d.slice(i + 1), pass)) return context.next();
    } catch (_) { /* だめなときは下で401 */ }
  }
  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"', 'Cache-Control': 'no-store' }
  });
};

export const config = { path: ['/admin', '/admin/*'] };
