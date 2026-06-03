## Why

After the first sessions, two real frictions show up for an organizer running the queue on a phone mid-game: mistaps (tapping the wrong winner, or ending a game by accident) have no recovery, and players who step away for a round force a remove-then-re-add dance. Both are quick to hit and annoying to clean up by hand. Separately, the current white/teal look reads dated; a dark "Midnight Violet" theme suits phone use at a court better.

## What Changes

- **Undo last game end.** Add a one-tap undo that reverses the most recent game end — whether it recorded a winner or was a void. It restores the court's teams, removes the four players from the back of the queue, and rolls back the stat changes. Single step only; the affordance appears only when there is a game end to reverse.
- **Bench / pause a player.** Add the ability to set a queued player aside (out of the queue, not on a court, not deleted, stats retained) and resume them later (back of the queue). Benched players appear in their own section. On-court players cannot be benched. The small-group warning counts only players available to play, excluding benched players.
- **Midnight Violet rebrand.** Restyle the app from white/teal to the dark Midnight Violet palette (indigo→violet accent). Update the PWA manifest `theme_color`/`background_color`, the iOS status-bar styling, and regenerate the app icons in the violet palette. Visual only — no behavior change.

## Capabilities

### New Capabilities
<!-- None — all changes extend existing capabilities. -->

### Modified Capabilities
- `match-tracking`: Adds the ability to undo the most recent recorded result (rolling back per-player stat changes). The stats-decoupled-from-queue invariant is preserved.
- `rotation-queue`: Adds undo of the most recent game end restoring the court to playing and removing the returned players from the queue. Modifies the small-group warning to count only players available to play (active queue + on court), excluding benched players.
- `roster-management`: Adds benching (pausing) a queued player and resuming them to the back of the queue; benching is blocked for on-court players.

## Impact

- **Engine** (`src/lib/engine.ts`): new `lastGameEnd` memory on `AppState` to support deterministic undo; `undoLastGameEnd`, `benchPlayer`, `resumePlayer` functions; `smallGroupWarning` adjusted to ignore benched players. New `benched` collection on `AppState` (state shape change → bump persisted `version` and discard older state on load, consistent with current behavior).
- **Store** (`src/state/store.tsx`): expose `undoLastGameEnd`, `benchPlayer`, `resumePlayer`.
- **UI**: undo control on the Courts view; a "Benched" section with resume control on the Queue view; full restyle to Midnight Violet across `styles.css`, `index.html` meta, `vite.config.ts` manifest, and `scripts/generate-icons.mjs`.
- **Tests**: new engine tests for undo (winner + void paths), bench/resume invariants, and the adjusted warning.
- **No change** to deferred items: multi-step undo, numeric scores, smarter shuffle, export/backup, saved roster, session reset.
