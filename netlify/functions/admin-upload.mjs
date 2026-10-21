// 管理サイト:画像をアップロードする
import { getStore } from '@netlify/blobs';
import { randomUUID } from 'node:crypto';
import { isAdmin, denied, json } from '../lib/auth.mjs';

const TYPES = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif' };
const MAX = 4 * 1024 * 1024; // 4MBまで

export default async (req) => {
  if (!isAdmin(req)) return denied();
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);
  const type = (req.headers.get('content-type') || '').split(';')[0].trim();
  if (!TYPES[type]) return json({ error: '画像(webp / jpg / png / gif)だけアップできます' }, 415);
  const buf = await req.arrayBuffer();
  if (buf.byteLength > MAX) return json({ error: '画像が大きすぎます(4MBまで)' }, 413);
  const key = randomUUID() + '.' + TYPES[type];
  await getStore('uploads').set(key, buf, { metadata: { type } });
  return json({ url: '/u/' + key });
};

export const config = { path: '/admin/api/upload' };
