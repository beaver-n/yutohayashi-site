// ゲームが終わったら、点数をチームに足す
import { createHash } from 'node:crypto';
import { json } from '../lib/auth.mjs';
import { scoreStore, readScores, readGames, isActive } from '../lib/game.mjs';

const WAIT_MS = 10 * 1000; // 同じ人からの送信は10秒に1回まで

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405);
  let body;
  try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
  const team = body && body.team;
  if (team !== 'a' && team !== 'b') return json({ error: 'team' }, 400);
  const games = await readGames();
  const g = games.find((x) => x && x.id === body.game);
  if (!g || !isActive(g)) return json({ error: 'game' }, 400);
  const max = Math.max(1, Math.min(100000, Number(g.max) || 300));
  const score = Math.max(0, Math.min(max, Math.round(Number(body.score) || 0)));
  if (!score) return json({ error: 'score' }, 400);

  const store = scoreStore();
  const ip = (context && context.ip) || req.headers.get('x-nf-client-connection-ip') || 'unknown';
  const key = 'ip/' + createHash('sha256').update(ip).digest('hex').slice(0, 24);
  const last = Number(await store.get(key)) || 0;
  if (Date.now() - last < WAIT_MS) return json({ error: 'too fast' }, 429);
  await store.set(key, String(Date.now()));

  const s = await readScores(store);
  s.total[team] += score;
  const gs = s.games[g.id] || { a: 0, b: 0 };
  gs[team] = (Number(gs[team]) || 0) + score;
  s.games[g.id] = gs;
  await store.setJSON('scores', s);
  return json(s);
};

export const config = { path: '/api/game/score' };
