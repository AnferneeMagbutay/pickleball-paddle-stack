## Context

Greenfield, single-purpose tool: one organizer runs a pickleball queue from their iPhone at a court, often with no signal. The proposal fixes the behavior (paddle-stack rotation, randomized partners, result-blind queue, per-player stats). This document settles the technical approach: how to ship a $0, installable, fully offline app with durable local state.

Constraints:
- **Offline-first**: must work with no network once loaded.
- **$0**: free static hosting, no backend, no paid APIs.
- **iPhone-first**: primary target is mobile Safari, installed via Add to Home Screen. Touch-friendly, one-handed operation.
- **Single device, single user**: no accounts, no sync, no concurrency between devices.

## Goals / Non-Goals

**Goals:**
- Installable PWA with offline app shell and durable local persistence.
- Correct paddle-stack rotation across 1–2 courts with randomized partners.
- Organizer overrides (add/remove/reorder) that keep the queue consistent.
- Per-player stats and leaderboard, decoupled from queue ordering.
- Fast, touch-first UI usable on a phone mid-game.

**Non-Goals:**
- Numeric score entry, skill-based balancing, accounts, multi-device sync (all deferred).
- Backend, real-time updates, or any network dependency at runtime.
- Theming/customization beyond a clean usable default.

## Decisions

### Stack: Vite + React + TypeScript + `vite-plugin-pwa`
- **Why**: Vite gives a zero-config static build deployable to any free host. `vite-plugin-pwa` generates the manifest + service worker (Workbox) for installability and offline caching with minimal setup. React+TS keeps the small state machine readable and typed.
- **Alternatives considered**: Vanilla JS (less scaffolding but more hand-rolled state/DOM for the queue/court views); Svelte (smaller bundle, but React is more broadly familiar for handoff). The app is small enough that bundle size is not a deciding factor; favor familiarity and the mature PWA plugin.

### Persistence: `localStorage`, single serialized app-state object
- **Why**: State is tiny (a few dozen players + small stats). A single JSON blob written on every state change is simple and synchronous. No schema/migration machinery needed for v1.
- **Alternatives considered**: IndexedDB (overkill for this data volume; async API adds complexity). Revisit only if we add history/export with larger datasets.
- Persistence is a thin layer: load on boot, save on every mutation. A `version` field is stored to allow a future migration if the shape changes.

### State model
```
AppState {
  players:  Player[]                 // roster: { id, name }
  queue:    PlayerId[]               // order = position in line (index 0 = front)
  courts:   Court[]                  // length 1 or 2, configurable
  stats:    Record<PlayerId, { wins, losses, games }>
  version:  number
}
Court {
  id; status: 'open' | 'playing';
  teamA: [PlayerId, PlayerId] | null
  teamB: [PlayerId, PlayerId] | null
}
```
- **Queue is the single source of truth for "who's next."** Courts hold only the currently-playing 4.
- **Stats are a separate map keyed by player id.** Nothing in the rotation logic reads `stats`; nothing in stats writes to `queue`. This decoupling is the core invariant from the proposal.

### Pulling players to a court / partner randomization
- When a court is `open` and the queue has ≥4 players, "Start game" pulls the front 4 out of the queue, Fisher-Yates shuffles them, and splits into `teamA = [0,1]`, `teamB = [2,3]`.
- Two courts draw from the same queue sequentially (the second court can only pull what remains after the first).

### Ending a game / rotation
- "End game" on a playing court asks the organizer to tap the winning team.
- On confirm: increment `games` for all 4; `wins` for the 2 winners, `losses` for the 2 losers; append all 4 players to the **back** of the queue; set the court back to `open`.
- Append order is deterministic (teamA then teamB); rotation is result-blind, so order among the 4 does not encode win/loss.

### Overrides keep invariants
- **Add**: append new player to roster and to the back of the queue.
- **Remove**: a player currently in the queue is dropped from `queue`; a player currently on a court blocks removal until the game ends (or the game is voided) — simpler than mid-game substitution. Stats are retained.
- **Reorder/bump**: move a queued player's index; only affects players in `queue`, never those on a court.

### Small-group warning
- Computed, not enforced: if `queueLength + playersOnCourts < 4 * courtCount + 4`, show a non-blocking banner that back-to-back games are unavoidable. (One court → threshold is 8.)

## Risks / Trade-offs

- **localStorage cleared / Safari evicts data** → State loss. Mitigation: acceptable for v1 (a session is one evening). A JSON export/import is a candidate follow-up.
- **Removing a player mid-game** → Disallowed for simplicity; could frustrate if someone leaves mid-point. Mitigation: organizer can "void" the game to free the court, then remove. Documented in UI.
- **Two courts + thin queue** → Second court may not have 4 to pull. Mitigation: "Start game" is disabled when <4 remain; clear messaging.
- **Randomized partners can repeat pairings** by chance in small groups → Expected, not a bug. Pure randomization per the proposal; no anti-repeat logic in v1.
- **iOS PWA quirks** (service worker update timing, home-screen storage limits) → Mitigation: keep cached assets small; use `vite-plugin-pwa` auto-update; test install + offline reload on a real iPhone before shipping.
