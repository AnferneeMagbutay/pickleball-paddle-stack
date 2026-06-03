import { shuffle } from "./shuffle";
import type {
  AppState,
  Court,
  GameOutcome,
  PlayerId,
  PlayerStats,
} from "./types";

export const CURRENT_VERSION = 2;
export const PLAYERS_PER_GAME = 4;
const MAX_COURTS = 2;

function makeCourt(id: number): Court {
  return { id, status: "open", teamA: null, teamB: null };
}

export function initialState(courtCount = 1): AppState {
  const n = clampCourts(courtCount);
  return {
    version: CURRENT_VERSION,
    players: [],
    queue: [],
    courts: Array.from({ length: n }, (_, i) => makeCourt(i + 1)),
    benched: [],
    stats: {},
    lastGameEnd: null,
  };
}

function clampCourts(n: number): number {
  return n >= MAX_COURTS ? MAX_COURTS : 1;
}

function emptyStats(): PlayerStats {
  return { wins: 0, losses: 0, games: 0 };
}

export function isOnCourt(state: AppState, id: PlayerId): boolean {
  return state.courts.some(
    (c) => c.teamA?.includes(id) || c.teamB?.includes(id),
  );
}

export function addPlayer(
  state: AppState,
  name: string,
  id: PlayerId,
): AppState {
  const trimmed = name.trim();
  if (!trimmed) return state;
  return {
    ...state,
    players: [...state.players, { id, name: trimmed }],
    queue: [...state.queue, id],
    stats: { ...state.stats, [id]: emptyStats() },
    lastGameEnd: null,
  };
}

export function removePlayer(state: AppState, id: PlayerId): AppState {
  if (isOnCourt(state, id)) return state;
  return {
    ...state,
    players: state.players.filter((p) => p.id !== id),
    queue: state.queue.filter((q) => q !== id),
    benched: state.benched.filter((b) => b !== id),
    lastGameEnd: null,
    // stats entry is intentionally retained, per spec.
  };
}

export function benchPlayer(state: AppState, id: PlayerId): AppState {
  if (!state.queue.includes(id)) return state;
  return {
    ...state,
    queue: state.queue.filter((q) => q !== id),
    benched: [...state.benched, id],
    lastGameEnd: null,
  };
}

export function resumePlayer(state: AppState, id: PlayerId): AppState {
  if (!state.benched.includes(id)) return state;
  return {
    ...state,
    benched: state.benched.filter((b) => b !== id),
    queue: [...state.queue, id],
    lastGameEnd: null,
  };
}

export function moveInQueue(
  state: AppState,
  id: PlayerId,
  targetIndex: number,
): AppState {
  const idx = state.queue.indexOf(id);
  if (idx === -1) return state;
  const next = state.queue.slice();
  next.splice(idx, 1);
  const clamped = Math.max(0, Math.min(targetIndex, next.length));
  next.splice(clamped, 0, id);
  return { ...state, queue: next, lastGameEnd: null };
}

export function setCourtCount(state: AppState, count: number): AppState {
  const target = clampCourts(count);
  const current = state.courts.length;
  if (target === current) return state;
  if (target > current) {
    const added = Array.from({ length: target - current }, (_, i) =>
      makeCourt(current + i + 1),
    );
    return { ...state, courts: [...state.courts, ...added], lastGameEnd: null };
  }
  const dropped = state.courts.slice(target);
  if (dropped.some((c) => c.status === "playing")) return state;
  return {
    ...state,
    courts: state.courts.slice(0, target),
    lastGameEnd: null,
  };
}

export function canStartGame(state: AppState, courtId: number): boolean {
  const court = state.courts.find((c) => c.id === courtId);
  return Boolean(
    court && court.status === "open" && state.queue.length >= PLAYERS_PER_GAME,
  );
}

export function startGame(
  state: AppState,
  courtId: number,
  shuffleFn: <T>(items: readonly T[]) => T[] = shuffle,
): AppState {
  if (!canStartGame(state, courtId)) return state;
  const four = state.queue.slice(0, PLAYERS_PER_GAME);
  const rest = state.queue.slice(PLAYERS_PER_GAME);
  const s = shuffleFn(four);
  return {
    ...state,
    queue: rest,
    courts: state.courts.map((c) =>
      c.id === courtId
        ? { ...c, status: "playing", teamA: [s[0], s[1]], teamB: [s[2], s[3]] }
        : c,
    ),
    lastGameEnd: null,
  };
}

function bump(
  s: PlayerStats | undefined,
  d: Partial<PlayerStats>,
): PlayerStats {
  const base = s ?? emptyStats();
  return {
    wins: base.wins + (d.wins ?? 0),
    losses: base.losses + (d.losses ?? 0),
    games: base.games + (d.games ?? 0),
  };
}

export function endGame(
  state: AppState,
  courtId: number,
  winner: GameOutcome,
): AppState {
  const court = state.courts.find((c) => c.id === courtId);
  if (!court || court.status !== "playing" || !court.teamA || !court.teamB)
    return state;
  const { teamA, teamB } = court;
  const players = [...teamA, ...teamB];

  let stats = state.stats;
  if (winner === "A" || winner === "B") {
    const winners = winner === "A" ? teamA : teamB;
    const losers = winner === "A" ? teamB : teamA;
    stats = { ...stats };
    for (const id of winners)
      stats[id] = bump(stats[id], { wins: 1, games: 1 });
    for (const id of losers)
      stats[id] = bump(stats[id], { losses: 1, games: 1 });
  }

  return {
    ...state,
    stats,
    queue: [...state.queue, ...players],
    courts: state.courts.map((c) =>
      c.id === courtId ? { ...c, status: "open", teamA: null, teamB: null } : c,
    ),
    lastGameEnd: { courtId, teamA, teamB, outcome: winner },
  };
}

export function canUndo(state: AppState): boolean {
  return state.lastGameEnd !== null;
}

export function undoLastGameEnd(state: AppState): AppState {
  const record = state.lastGameEnd;
  if (!record) return state;
  const { courtId, teamA, teamB, outcome } = record;
  const four = [...teamA, ...teamB];

  let stats = state.stats;
  if (outcome === "A" || outcome === "B") {
    const winners = outcome === "A" ? teamA : teamB;
    const losers = outcome === "A" ? teamB : teamA;
    stats = { ...stats };
    for (const id of winners)
      stats[id] = bump(stats[id], { wins: -1, games: -1 });
    for (const id of losers)
      stats[id] = bump(stats[id], { losses: -1, games: -1 });
  }

  return {
    ...state,
    stats,
    queue: state.queue.filter((id) => !four.includes(id)),
    courts: state.courts.map((c) =>
      c.id === courtId ? { ...c, status: "playing", teamA, teamB } : c,
    ),
    lastGameEnd: null,
  };
}

export function winPct(stats: PlayerStats | undefined): number {
  if (!stats || stats.games === 0) return 0;
  return stats.wins / stats.games;
}

export interface LeaderboardRow {
  id: PlayerId;
  name: string;
  wins: number;
  losses: number;
  games: number;
  winPct: number;
}

export function leaderboard(state: AppState): LeaderboardRow[] {
  return state.players
    .map((p) => {
      const s = state.stats[p.id] ?? emptyStats();
      return {
        id: p.id,
        name: p.name,
        wins: s.wins,
        losses: s.losses,
        games: s.games,
        winPct: winPct(s),
      };
    })
    .sort(
      (a, b) =>
        b.wins - a.wins ||
        b.winPct - a.winPct ||
        b.games - a.games ||
        a.name.localeCompare(b.name),
    );
}

// Heuristic: with C courts, 4*C players occupy courts; a full extra game's
// worth waiting (4 more) is the minimum to avoid forced back-to-back play.
export function backToBackThreshold(courtCount: number): number {
  return courtCount * PLAYERS_PER_GAME + PLAYERS_PER_GAME;
}

export function smallGroupWarning(state: AppState): boolean {
  // Benched players are not in rotation, so they don't count toward avoiding
  // back-to-back games.
  const available = state.players.length - state.benched.length;
  return available >= 1 && available < backToBackThreshold(state.courts.length);
}
