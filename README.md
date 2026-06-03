# Pickleball Paddle Stack

An organizer-run pickleball queue for a known group at 1–2 courts. Runs entirely
on the organizer's phone as an installable, offline PWA. No accounts, no server,
no cost.

## How it works

- **Paddle-stack rotation.** One shared queue feeds the courts. When a court is
  open, the next 4 players are pulled and shuffled into two random 2v2 teams.
  When the game ends, all 4 go to the **back** of the queue — win or lose. That
  result-blind rotation is what stops winners from playing consecutive games.
- **Organizer overrides.** Add a late arrival (to the back), remove someone who
  leaves, and reorder/bump anyone waiting in the queue.
- **Score tracking, decoupled.** At game end, tap the winning team. The app
  tracks per-player wins / losses / games / win % on a leaderboard. Stats never
  affect queue order — winning earns leaderboard points, not court time.
- **Small-group warning.** With fewer than `4 × courts + 4` players, the app
  warns that back-to-back games are unavoidable (one court → 8 players).

## Run locally

```bash
npm install
npm run icons   # generate the PWA icon set into public/
npm run dev     # http://localhost:5173
```

## Test

```bash
npm test        # unit tests for the queue/stats engine
```

## Build and deploy ($0 hosting)

```bash
npm run build   # outputs static files to dist/
npm run preview # serve the production build locally
```

`dist/` is plain static files — deploy to any free static host:

- **GitHub Pages** — push `dist/` to a `gh-pages` branch (or use an action).
- **Netlify / Cloudflare Pages** — point at the repo, build command
  `npm run build`, publish directory `dist`.

The build uses a relative `base` (`./`), so it works from a subpath such as a
GitHub Pages project URL without extra configuration.

## Install on iPhone

Open the deployed URL in Safari → Share → **Add to Home Screen**. It launches
full-screen and works offline after the first load. State (roster, queue,
in-progress courts, stats) persists on the device via `localStorage`.

## Deferred (not in this version)

Numeric score entry (e.g. 11–7), skill-based matchmaking, player accounts, and
multi-device sync.
