## 1. Project scaffold

- [x] 1.1 Create a new standalone project directory for the PWA (separate from NIMS infra projects)
- [x] 1.2 Scaffold a Vite + React + TypeScript app
- [x] 1.3 Add and configure `vite-plugin-pwa` (web manifest: name, icons, standalone display; auto-update service worker)
- [x] 1.4 Add app icons (multiple sizes) and verify the manifest is valid
- [x] 1.5 Add a README with run/build/deploy instructions and the $0 hosting target

## 2. State model and persistence

- [x] 2.1 Define TypeScript types: `Player`, `Court`, `Stats`, `AppState` (with `version`)
- [x] 2.2 Implement a `localStorage` persistence layer: load on boot, save on every mutation
- [x] 2.3 Implement app state container (React state/store) seeded from persisted state
- [x] 2.4 Implement a Fisher-Yates shuffle utility (pure, unit-testable)

## 3. Rotation queue (capability: rotation-queue)

- [x] 3.1 Implement court count configuration (1 or 2 active courts)
- [x] 3.2 Implement "start game": pull front 4 from queue, shuffle into team A / team B, mark court playing
- [x] 3.3 Disable/guard "start game" when fewer than 4 are queued; show the required-players message
- [x] 3.4 Implement "end game": return all 4 players to the back of the queue, set court open (result-blind)
- [x] 3.5 Implement the small-group back-to-back warning (threshold: 4*courts + 4; one court = 8)
- [x] 3.6 Unit tests: pull/shuffle/return rotation, two-court sequential draw, threshold warning

## 4. Roster management (capability: roster-management)

- [x] 4.1 Add player (name required, appended to back of queue); reject empty name
- [x] 4.2 Remove a queued player; block removal of a player currently on a court; retain stats
- [x] 4.3 Reorder/bump a queued player; exclude players on a court from reordering
- [x] 4.4 Unit tests: add/remove/reorder invariants, removal-blocked-while-playing

## 5. Match tracking (capability: match-tracking)

- [x] 5.1 Winning-team prompt on game end (single tap); support void (free court, no result recorded)
- [x] 5.2 Update per-player stats on recorded result (wins/losses/games for the 4 players)
- [x] 5.3 Derive win percentage; leaderboard view ranked by record
- [x] 5.4 Verify stats never read by or write to queue/partner logic (decoupling invariant)
- [x] 5.5 Unit tests: stat updates, win% derivation, void path records nothing

## 6. UI / mobile

- [x] 6.1 Court view: show current teams per court, start/end controls (touch-first, one-handed)
- [x] 6.2 Queue view: ordered list with add/remove/reorder controls
- [x] 6.3 Leaderboard view
- [x] 6.4 Court-count toggle and small-group warning banner
- [x] 6.5 Responsive layout tuned for iPhone Safari standalone mode (safe-area insets, max-width, no-zoom)

## 7. Offline app shell (capability: offline-app-shell)

- [x] 7.1 Verify service worker caches all assets; app loads offline after first visit (build precaches 8 entries incl. sw.js; full offline reload confirmed in 8.1/8.3 on device)
- [x] 7.2 Verify state persists across reload/relaunch (roster, queue, in-progress courts, stats) — covered by `src/state/storage.test.ts`
- [x] 7.3 Confirm no runtime network calls / no auth — source grep: only `localStorage` in `storage.ts`, no fetch/XHR/WS/auth

## 8. Verification and deploy

- [ ] 8.1 Manual test on a real iPhone: install to home screen, run a full session offline (MANUAL — requires a device)
- [x] 8.2 Production build; deployed to GitHub Pages (gh-pages branch) at https://anferneemagbutay.github.io/pickleball-paddle-stack/ — repo AnferneeMagbutay/pickleball-paddle-stack
- [ ] 8.3 Smoke-test the deployed PWA: install + offline reload from the hosted URL (MANUAL — requires 8.2 + a device)
