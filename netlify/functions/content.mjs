// ポートフォリオが読む「サイトの中身」(保存されていなければ null → ページに入っている初期データを使う)
import { getStore } from '@netlify/blobs';
import { json } from '../lib/auth.mjs';

export default async () => {
  const store = getStore({ name: 'portfolio', consistency: 'strong' });
  const data = await store.get('content', { type: 'json' });
  return json(data || null);
};

export const config = { path: '/api/content' };
