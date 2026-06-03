## Why

A known group playing pickleball at 1–2 courts needs a fair way to manage who plays next without manual bookkeeping or a whiteboard. The standard "paddle stack" rotation (play, then go to the back of the line) keeps court time fair and prevents winners from monopolizing a court, but tracking it by hand is error-prone once a group grows. There is no existing tool in this workspace for this, and the organizer wants something that runs free on their phone at the court with no signal.

## What Changes

- Introduce a new standalone PWA project (separate from the NIMS infra projects) for an organizer-run pickleball queue.
- Implement a **paddle-stack rotation queue**: one shared queue feeds 1–2 courts; the next 4 players are pulled to an open court and shuffled into two randomized 2v2 teams; when a game ends, all 4 return to the back of the queue regardless of result.
- Provide **organizer overrides**: add a late arrival (to the back), remove a departing player, and manually reorder/bump players in the queue.
- Provide **match result tracking**: organizer taps the winning team at game end; the app records per-player wins, losses, games played, and win %, surfaced in a leaderboard. Stats are recorded independently of the queue and never influence queue order.
- Warn when the group is too small to avoid back-to-back games (e.g. fewer than 8 players with one court).
- Ship as an installable, fully **offline PWA** with all state persisted locally on the device. No accounts, no server, $0 hosting.

## Capabilities

### New Capabilities
- `rotation-queue`: The paddle-stack queue — shared queue feeding 1–2 courts, pulling the next 4 to an open court, randomizing partners into 2v2 teams, and returning all players to the back on game end (result-blind rotation). Includes the small-group back-to-back warning.
- `roster-management`: Organizer overrides for the player roster/queue — add a player to the back, remove a player, and manually reorder or bump a player's position.
- `match-tracking`: Recording a game result (tap the winning team) and per-player statistics (wins, losses, games played, win %) with a leaderboard view. Strictly decoupled from queue ordering.
- `offline-app-shell`: PWA installability (Add to Home Screen, app manifest, service worker) and local persistence of all queue and stats state so the app works fully offline and survives reloads.

### Modified Capabilities
<!-- None — this is a greenfield project with no existing specs. -->

## Impact

- **New project**: a new directory containing a self-contained PWA (HTML/CSS/JS or a lightweight framework — chosen in design.md). Not added to the NIMS provisioning pipeline.
- **No backend, no database service**: all state in browser local storage (localStorage/IndexedDB). No accounts, no network calls at runtime.
- **Hosting**: a free static host (GitHub Pages / Netlify / Cloudflare Pages). No paid services.
- **Out of scope (deferred to a later version)**: numeric score entry (e.g. 11–7), skill-based matchmaking/balancing, player accounts, and multi-device sync.
