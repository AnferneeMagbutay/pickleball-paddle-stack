import { leaderboard } from "../lib/engine";
import { useStore } from "../state/store";

export function LeaderboardView() {
  const { state } = useStore();
  const rows = leaderboard(state);

  if (rows.length === 0) {
    return (
      <p className="hint">No players yet. Add players from the Queue tab.</p>
    );
  }

  return (
    <table className="leaderboard">
      <thead>
        <tr>
          <th className="lb-name">Player</th>
          <th>W</th>
          <th>L</th>
          <th>GP</th>
          <th>Win %</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id}>
            <td className="lb-name">{r.name}</td>
            <td>{r.wins}</td>
            <td>{r.losses}</td>
            <td>{r.games}</td>
            <td>{r.games === 0 ? "—" : `${Math.round(r.winPct * 100)}%`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
