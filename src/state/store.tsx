import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as engine from "../lib/engine";
import type { AppState, GameOutcome } from "../lib/types";
import { loadState, saveState } from "./storage";

interface Store {
  state: AppState;
  addPlayer(name: string): void;
  removePlayer(id: string): void;
  moveInQueue(id: string, targetIndex: number): void;
  setCourtCount(count: number): void;
  startGame(courtId: number): void;
  endGame(courtId: number, winner: GameOutcome): void;
  undoLastGameEnd(): void;
  benchPlayer(id: string): void;
  resumePlayer(id: string): void;
}

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const store = useMemo<Store>(
    () => ({
      state,
      addPlayer: (name) =>
        setState((s) => engine.addPlayer(s, name, crypto.randomUUID())),
      removePlayer: (id) => setState((s) => engine.removePlayer(s, id)),
      moveInQueue: (id, target) =>
        setState((s) => engine.moveInQueue(s, id, target)),
      setCourtCount: (count) => setState((s) => engine.setCourtCount(s, count)),
      startGame: (courtId) => setState((s) => engine.startGame(s, courtId)),
      endGame: (courtId, winner) =>
        setState((s) => engine.endGame(s, courtId, winner)),
      undoLastGameEnd: () => setState((s) => engine.undoLastGameEnd(s)),
      benchPlayer: (id) => setState((s) => engine.benchPlayer(s, id)),
      resumePlayer: (id) => setState((s) => engine.resumePlayer(s, id)),
    }),
    [state],
  );

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used within a StoreProvider");
  return store;
}
