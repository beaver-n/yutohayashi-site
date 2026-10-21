// 管理サイト:サイトの中身を読む(GET)・保存する(PUT)
import { getStore } from '@netlify/blobs';
import { isAdmin, denied, json } from '../lib/auth.mjs';

const MAX = 2 * 1024 * 1024; // 2MBまで

export default async (req) => {
  if (!isAdmin(req)) return denied();
  const store = getStore({ name: 'portfolio', consistency: 'strong' });
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const key = url.searchParams.get('version') === 'prev' ? 'content-prev' : 'content';
    const data = await store.get(key, { type: 'json' });
    return json({ content: data || null });
  }

  if (req.method === 'PUT') {
    const text = await req.text();
    if (text.length > MAX) return json({ error: '大きすぎます' }, 413);
    let data;
    try { data = JSON.parse(text); } catch { return json({ error: 'JSONの形がおかしいです' }, 400); }
    if (!data || !Array.isArray(data.works) || !Array.isArray(data.future)) return json({ error: '作品のデータがありません' }, 400);
    const old = await store.get('content', { type: 'json' });
    if (old) await store.setJSON('content-prev', old);
    data.savedAt = new Date().toISOString();
    await store.setJSON('content', data);
    return json({ ok: true, savedAt: data.savedAt });
  }

  return json({ error: 'Method Not Allowed' }, 405);
};

export const config = { path: '/admin/api/content' };
