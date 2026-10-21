// みんなが見る:チームの点数
import { json } from '../lib/auth.mjs';
import { scoreStore, readScores } from '../lib/game.mjs';

export default async () => json(await readScores(scoreStore()));

export const config = { path: '/api/game' };
