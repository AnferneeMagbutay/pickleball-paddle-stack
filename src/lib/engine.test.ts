import { describe, expect, it } from "vitest";
import {
  addPlayer,
  backToBackThreshold,
  canStartGame,
  endGame,
  initialState,
  leaderboard,
  moveInQueue,
  removePlayer,
  setCourtCount,
  smallGroupWarning,
  startGame,
  winPct,
} from "./engine";
import type { AppState } from "./types";

const noShuffle = <T>(items: readonly T[]): T[] => items.slice();

function withPlayers(names: string[], courtCount = 1): AppState {
  let state = initialState(courtCount);
  for (const name of names) state = addPlayer(state, name, name);
  return state;
}

describe("roster management", () => {
  it("adds a player to the back of the queue", () => {
    const state = addPlayer(initialState(), "Ana", "ana");
    expect(state.players).toHaveLength(1);
    expect(state.queue).toEqual(["ana"]);
    expect(state.stats["ana"]).toEqual({ wins: 0, losses: 0, games: 0 });
  });

  it("rejects an empty or whitespace name", () => {
    const state = addPlayer(initialState(), "   ", "x");
    expect(state.players).toHaveLength(0);
    expect(state.queue).toHaveLength(0);
  });

  it("removes a queued player and keeps the others in order", () => {
    const state = removePlayer(withPlayers(["a", "b", "c"]), "b");
    expect(state.queue).toEqual(["a", "c"]);
    expect(state.players.map((p) => p.id)).toEqual(["a", "c"]);
  });

  it("blocks removal of a player currently on a court", () => {
    let state = startGame(withPlayers(["a", "b", "c", "d"]), 1, noShuffle);
    const before = state;
    state = removePlayer(state, "a");
    expect(state).toBe(before);
    expect(state.players.map((p) => p.id)).toContain("a");
  });

  it("retains stats when a player is removed", () => {
    let state = startGame(withPlayers(["a", "b", "c", "d"]), 1, noShuffle);
    state = endGame(state, 1, "A"); // a,b win
    state = removePlayer(state, "a");
    expect(state.stats["a"]).toEqual({ wins: 1, losses: 0, games: 1 });
  });

  it("bumps a queued player forward and excludes playing players", () => {
    let state = withPlayers(["a", "b", "c", "d", "e"]);
    state = moveInQueue(state, "d", 0);
    expect(state.queue).toEqual(["d", "a", "b", "c", "e"]);

    state = startGame(state, 1, noShuffle); // pulls d,a,b,c
    const before = state.queue.slice();
    state = moveInQueue(state, "a", 0); // a is on court → no-op
    expect(state.queue).toEqual(before);
  });
});

describe("rotation queue", () => {
  it("pulls the front 4 and forms two teams", () => {
    const state = startGame(
      withPlayers(["a", "b", "c", "d", "e"]),
      1,
      noShuffle,
    );
    const court = state.courts[0];
    expect(court.status).toBe("playing");
    expect(court.teamA).toEqual(["a", "b"]);
    expect(court.teamB).toEqual(["c", "d"]);
    expect(state.queue).toEqual(["e"]);
  });

  it("will not start with fewer than 4 queued", () => {
    const state = withPlayers(["a", "b", "c"]);
    expect(canStartGame(state, 1)).toBe(false);
    expect(startGame(state, 1, noShuffle)).toBe(state);
  });

  it("returns all four players to the back regardless of result", () => {
    let state = withPlayers(["a", "b", "c", "d", "e"]);
    state = startGame(state, 1, noShuffle); // court: a,b vs c,d; queue: [e]
    state = endGame(state, 1, "A"); // a,b win
    expect(state.queue).toEqual(["e", "a", "b", "c", "d"]);
    expect(state.courts[0].status).toBe("open");
  });

  it("gives winners no queue priority over losers", () => {
    let state = withPlayers(["a", "b", "c", "d"]);
    state = startGame(state, 1, noShuffle);
    state = endGame(state, 1, "B"); // c,d win
    // Order is teamA then teamB — result does not reorder.
    expect(state.queue).toEqual(["a", "b", "c", "d"]);
  });

  it("lets two courts draw sequentially from one queue", () => {
    let state = withPlayers(["a", "b", "c", "d", "e", "f", "g", "h"], 2);
    state = startGame(state, 1, noShuffle);
    state = startGame(state, 2, noShuffle);
    expect(state.courts[0].teamA).toEqual(["a", "b"]);
    expect(state.courts[1].teamA).toEqual(["e", "f"]);
    expect(state.queue).toEqual([]);
  });

  it("setCourtCount will not drop a court mid-game", () => {
    let state = withPlayers(["a", "b", "c", "d", "e", "f", "g", "h"], 2);
    state = startGame(state, 2, noShuffle);
    const before = state;
    state = setCourtCount(state, 1);
    expect(state).toBe(before);
  });
});

describe("small-group warning", () => {
  it("uses 4*courts + 4 as the threshold", () => {
    expect(backToBackThreshold(1)).toBe(8);
    expect(backToBackThreshold(2)).toBe(12);
  });

  it("warns below threshold and not at/above it (one court)", () => {
    expect(
      smallGroupWarning(withPlayers(["a", "b", "c", "d", "e", "f", "g"])),
    ).toBe(true);
    const eight = withPlayers(["a", "b", "c", "d", "e", "f", "g", "h"]);
    expect(smallGroupWarning(eight)).toBe(false);
  });

  it("does not warn with no players", () => {
    expect(smallGroupWarning(initialState(1))).toBe(false);
  });
});

describe("match tracking", () => {
  it("records wins, losses, and games for the four players", () => {
    let state = startGame(withPlayers(["a", "b", "c", "d"]), 1, noShuffle);
    state = endGame(state, 1, "A");
    expect(state.stats["a"]).toEqual({ wins: 1, losses: 0, games: 1 });
    expect(state.stats["b"]).toEqual({ wins: 1, losses: 0, games: 1 });
    expect(state.stats["c"]).toEqual({ wins: 0, losses: 1, games: 1 });
    expect(state.stats["d"]).toEqual({ wins: 0, losses: 1, games: 1 });
  });

  it("records nothing on a voided game but still frees the court", () => {
    let state = startGame(withPlayers(["a", "b", "c", "d"]), 1, noShuffle);
    state = endGame(state, 1, null);
    expect(state.stats["a"]).toEqual({ wins: 0, losses: 0, games: 0 });
    expect(state.courts[0].status).toBe("open");
    expect(state.queue).toEqual(["a", "b", "c", "d"]);
  });

  it("derives win percentage", () => {
    expect(winPct({ wins: 0, losses: 0, games: 0 })).toBe(0);
    expect(winPct({ wins: 3, losses: 1, games: 4 })).toBe(0.75);
  });

  it("ranks the leaderboard by wins then win %", () => {
    let state = withPlayers(["a", "b", "c", "d"]);
    state = startGame(state, 1, noShuffle);
    state = endGame(state, 1, "A"); // a,b win
    const rows = leaderboard(state);
    expect(rows[0].wins).toBe(1);
    expect(
      rows
        .map((r) => r.id)
        .slice(0, 2)
        .sort(),
    ).toEqual(["a", "b"]);
  });

  it("does not let stats affect queue order", () => {
    let state = withPlayers(["a", "b", "c", "d", "e", "f", "g", "h"]);
    state = startGame(state, 1, noShuffle); // a,b vs c,d
    const queueAfterStart = state.queue.slice();
    state = endGame(state, 1, "A");
    // Winners a,b land at the very back, behind everyone who was waiting.
    expect(state.queue).toEqual([...queueAfterStart, "a", "b", "c", "d"]);
  });
});
