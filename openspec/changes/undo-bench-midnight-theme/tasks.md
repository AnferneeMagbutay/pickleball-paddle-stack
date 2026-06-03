## 1. State model

- [x] 1.1 Add `benched: PlayerId[]` and `lastGameEnd: GameEndRecord | null` to `AppState`; define `GameEndRecord` ({ courtId, teamA, teamB, outcome })
- [x] 1.2 Bump `CURRENT_VERSION` 1 → 2; update `initialState` to seed `benched: []` and `lastGameEnd: null`

## 2. Undo (capabilities: rotation-queue, match-tracking)

- [x] 2.1 `endGame` records `lastGameEnd` ({ courtId, teamA, teamB, outcome })
- [x] 2.2 Every other mutating function (add/remove/move/setCourtCount/startGame/bench/resume) sets `lastGameEnd = null`
- [x] 2.3 Implement `undoLastGameEnd`: restore court to playing with saved teams, remove the four ids from the queue, roll back stats (inverse of endGame; void → no stat change), then clear `lastGameEnd`
- [x] 2.4 Add `canUndo(state)` helper (`lastGameEnd !== null`)
- [x] 2.5 Unit tests: undo winner path (court + queue + stats), undo void path (no stat change), undo unavailable after another action, single-step only

## 3. Bench / resume (capability: roster-management)

- [x] 3.1 Implement `benchPlayer`: queued player → benched; block if on court; no-op if already benched
- [x] 3.2 Implement `resumePlayer`: benched player → back of queue
- [x] 3.3 Extend `removePlayer` to also drop the id from `benched` (still blocked while on court; stats retained)
- [x] 3.4 Update `smallGroupWarning` to count available players only (`players.length − benched.length`)
- [x] 3.5 Unit tests: bench/resume invariants, bench blocked on court, remove benched, warning excludes benched

## 4. Store wiring

- [x] 4.1 Expose `undoLastGameEnd`, `benchPlayer`, `resumePlayer` from the store

## 5. UI

- [x] 5.1 Courts view: undo control, shown only when `canUndo(state)` is true
- [x] 5.2 Queue view: "Benched" section listing benched players with a Resume control; bench control on active queue rows
- [x] 5.3 Verify on-court players cannot be benched in the UI (no bench control)

## 6. Midnight Violet rebrand (UI styling only)

- [x] 6.1 Update `styles.css` CSS custom properties to the Midnight Violet palette; header/primary buttons/position chips use the 135deg indigo→violet gradient
- [x] 6.2 Update `index.html` `theme-color` and iOS status-bar meta to the dark palette
- [x] 6.3 Update `vite.config.ts` manifest `theme_color`/`background_color`
- [x] 6.4 Update `scripts/generate-icons.mjs` to the violet palette and regenerate the icons (commit the PNGs)

## 7. Verification

- [x] 7.1 Run the test suite (existing + new) — all green
- [x] 7.2 Typecheck and production build clean; manifest + icons valid
- [ ] 7.3 Manual check on device: undo, bench/resume, and the new look (MANUAL)