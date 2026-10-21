// ゲームの点数を保存するところ(Netlify Blobs)
import { getStore } from '@netlify/blobs';

export const DEFAULT_GAMES = [
  { id: 'scare', type: 'limited', show: true, start: '2026-10-01', end: '2026-10-31', max: 300 },
  { id: 'lights', type: 'permanent', show: true, max: 300 },
  { id: 'queue', type: 'permanent', show: true, max: 300 },
  { id: 'parade', type: 'permanent', show: true, max: 300 }
];

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
  const g = c && c.game && Array.isArray(c.game.games) ? c.game.games.slice() : [];
  const removed = c && c.game && Array.isArray(c.game.removed) ? c.game.removed : [];
  // 新しく足したゲームは、管理サイトで「削除」していなければ自動で入る
  for (const d of DEFAULT_GAMES) {
    if (!g.some((x) => x && x.id === d.id) && !removed.includes(d.id)) g.push(d);
  }
  return g;
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
