// 管理サイト:点数を見る・0にもどす・手で直す
import { isAdmin, denied, json } from '../lib/auth.mjs';
import { scoreStore, readScores } from '../lib/game.mjs';

export default async (req) => {
  if (!isAdmin(req)) return denied();
  const store = scoreStore();
  if (req.method === 'GET') return json(await readScores(store));
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);
  let b;
  try { b = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
  const s = await readScores(store);
  if (b.action === 'reset-all') {
    s.total = { a: 0, b: 0 }; s.games = {};
  } else if (b.action === 'reset-game' && typeof b.game === 'string') {
    const gs = s.games[b.game] || { a: 0, b: 0 };
    s.total.a = Math.max(0, s.total.a - (Number(gs.a) || 0));
    s.total.b = Math.max(0, s.total.b - (Number(gs.b) || 0));
    delete s.games[b.game];
  } else if (b.action === 'adjust' && (b.team === 'a' || b.team === 'b')) {
    const d = Math.round(Number(b.delta) || 0);
    s.total[b.team] = Math.max(0, s.total[b.team] + d);
  } else {
    return json({ error: 'action' }, 400);
  }
  await store.setJSON('scores', s);
  return json(s);
};

export const config = { path: '/admin/api/game' };
