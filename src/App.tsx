import { useState } from "react";
import { smallGroupWarning } from "./lib/engine";
import { useStore } from "./state/store";
import { CourtsView } from "./components/CourtsView";
import { QueueView } from "./components/QueueView";
import { LeaderboardView } from "./components/LeaderboardView";

type Tab = "courts" | "queue" | "leaderboard";

const TABS: { id: Tab; label: string }[] = [
  { id: "courts", label: "Courts" },
  { id: "queue", label: "Queue" },
  { id: "leaderboard", label: "Leaderboard" },
];

export function App() {
  const { state, setCourtCount } = useStore();
  const [tab, setTab] = useState<Tab>("courts");
  const courtCount = state.courts.length;
  const courtTwoPlaying = (state.courts[1]?.status ?? "open") === "playing";

  return (
    <div className="app">
      <header className="app-header">
        <h1>Paddle Stack</h1>
        <div
          className="court-toggle"
          role="group"
          aria-label="Number of courts"
        >
          <span className="court-toggle-label">Courts</span>
          {[1, 2].map((n) => (
            <button
              key={n}
              className={courtCount === n ? "chip chip-active" : "chip"}
              aria-pressed={courtCount === n}
              disabled={n === 1 && courtTwoPlaying}
              onClick={() => setCourtCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </header>

      {smallGroupWarning(state) && (
        <p className="banner" role="status">
          ⚠ Small group — some players will play back-to-back games.
        </p>
      )}

      <main className="app-main">
        {tab === "courts" && <CourtsView />}
        {tab === "queue" && <QueueView />}
        {tab === "leaderboard" && <LeaderboardView />}
      </main>

      <nav className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "tab tab-active" : "tab"}
            aria-current={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
