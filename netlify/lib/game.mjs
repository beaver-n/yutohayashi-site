// ゲームの点数を保存するところ(Netlify Blobs)
import { getStore } from '@netlify/blobs';

export const DEFAULT_GAMES = [{ id: 'parade', type: 'permanent', show: true, max: 300 }];

export function scoreStore() {
  return getStore({ name: 'game', consistency: 'strong' });
}

export async function readScores(store) {
  const s = (await store.get('scores', { type: 'json' })) || {};
  return {
    total: { a: Number(s.total && s.total.a) || 0, b: Number(s.total && s.total.b) || 0 },
    games: s.games && typeof s.games === 'object' ? s.games : {}
  };
}

// 管理サイトで保存したゲームの設定(なければ最初の設定)
export async function readGames() {
  const c = await getStore({ name: 'portfolio', consistency: 'strong' }).get('content', { type: 'json' });
  const g = c && c.game && Array.isArray(c.game.games) ? c.game.games : null;
  return g || DEFAULT_GAMES;
}

export function today() {
  // 日本時間の今日(YYYY-MM-DD)
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

export function isActive(g) {
  if (!g || g.show === false) return false;
  if (g.type !== 'limited') return true;
  const t = today();
  return (!g.start || g.start <= t) && (!g.end || t <= g.end);
}
