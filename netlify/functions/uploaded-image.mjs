// 管理サイトでアップロードした画像を見せる
import { getStore } from '@netlify/blobs';

export default async (req) => {
  const key = decodeURIComponent(new URL(req.url).pathname.replace(/^\/u\//, ''));
  if (!/^[a-f0-9-]+\.(webp|jpg|png|gif)$/.test(key)) return new Response('Not Found', { status: 404 });
  const r = await getStore('uploads').getWithMetadata(key, { type: 'arrayBuffer' });
  if (!r) return new Response('Not Found', { status: 404 });
  return new Response(r.data, {
    headers: { 'Content-Type': (r.metadata && r.metadata.type) || 'application/octet-stream', 'Cache-Control': 'public, max-age=31536000, immutable' }
  });
};

export const config = { path: '/u/*' };
