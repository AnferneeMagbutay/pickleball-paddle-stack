import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { addPlayer, endGame, initialState, startGame } from "../lib/engine";
import { loadState, saveState } from "./storage";

function installLocalStorageStub() {
  const map = new Map<string, string>();
  const stub = {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: (i: number) => [...map.keys()][i] ?? null,
    get length() {
      return map.size;
    },
  };
  (globalThis as unknown as { localStorage: typeof stub }).localStorage = stub;
  return map;
}

const noShuffle = <T>(items: readonly T[]): T[] => items.slice();

describe("storage persistence", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = installLocalStorageStub();
  });

  afterEach(() => {
    store.clear();
  });

  it("returns a clean initial state when nothing is saved", () => {
    expect(loadState()).toEqual(initialState(1));
  });

  it("round-trips a session: roster, queue, in-progress court, and stats survive", () => {
    let state = initialState(1);
    for (const n of ["a", "b", "c", "d", "e"]) state = addPlayer(state, n, n);
    state = startGame(state, 1, noShuffle); // a,b vs c,d ; queue [e]
    saveState(state);

    const reloaded = loadState();
    expect(reloaded).toEqual(state);
    expect(reloaded.courts[0].status).toBe("playing");
    expect(reloaded.queue).toEqual(["e"]);

    let next = endGame(reloaded, 1, "A");
    saveState(next);
    const reloaded2 = loadState();
    expect(reloaded2.stats["a"]).toEqual({ wins: 1, losses: 0, games: 1 });
    expect(reloaded2.stats["c"]).toEqual({ wins: 0, losses: 1, games: 1 });
    expect(reloaded2.courts[0].status).toBe("open");
  });

  it("falls back to a clean state when stored data is corrupt", () => {
    store.set("pps.appstate", "{not valid json");
    expect(loadState()).toEqual(initialState(1));
  });

  it("discards state from an incompatible version", () => {
    store.set(
      "pps.appstate",
      JSON.stringify({ version: 999, players: [{ id: "x", name: "X" }] }),
    );
    expect(loadState()).toEqual(initialState(1));
  });
});
