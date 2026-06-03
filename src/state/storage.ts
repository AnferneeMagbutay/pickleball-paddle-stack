import { CURRENT_VERSION, initialState } from "../lib/engine";
import type { AppState } from "../lib/types";

const KEY = "pps.appstate";

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState(1);
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      parsed.version !== CURRENT_VERSION
    ) {
      return initialState(1);
    }
    return parsed as AppState;
  } catch {
    // Corrupt or unavailable storage: start clean rather than crash.
    return initialState(1);
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Quota or private-mode failure: a lost save is preferable to a crash mid-session.
  }
}
