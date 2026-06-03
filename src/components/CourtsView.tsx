import { useState } from "react";
import { canStartGame, canUndo } from "../lib/engine";
import { useStore } from "../state/store";
import type { Team } from "../lib/types";
import { useNameLookup } from "./useNameLookup";

export function CourtsView() {
  const { state, startGame, endGame, undoLastGameEnd } = useStore();
  const nameOf = useNameLookup();
  const [endingCourtId, setEndingCourtId] = useState<number | null>(null);

  const teamLabel = (team: Team) => team.map(nameOf).join(" + ");

  return (
    <>
      {canUndo(state) && (
        <div className="undo-bar">
          <span>Last game recorded.</span>
          <button
            className="btn btn-ghost btn-inline"
            onClick={undoLastGameEnd}
          >
            Undo
          </button>
        </div>
      )}
      <ul className="court-list">
        {state.courts.map((court) => {
          if (court.status === "open") {
            const ready = canStartGame(state, court.id);
            return (
              <li key={court.id} className="court court-open">
                <div className="court-head">Court {court.id}</div>
                <p className="court-empty">Open</p>
                <button
                  className="btn btn-primary"
                  disabled={!ready}
                  onClick={() => startGame(court.id)}
                >
                  Start game
                </button>
                {!ready && (
                  <p className="hint">Need 4 players in the queue to start.</p>
                )}
              </li>
            );
          }

          const ending = endingCourtId === court.id;
          return (
            <li key={court.id} className="court court-playing">
              <div className="court-head">Court {court.id}</div>
              <div className="matchup">
                <span className="team">
                  {court.teamA && teamLabel(court.teamA)}
                </span>
                <span className="vs">vs</span>
                <span className="team">
                  {court.teamB && teamLabel(court.teamB)}
                </span>
              </div>

              {!ending ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setEndingCourtId(court.id)}
                >
                  End game
                </button>
              ) : (
                <div className="end-prompt">
                  <p className="hint">Who won?</p>
                  <div className="end-actions">
                    <button
                      className="btn btn-win"
                      onClick={() => {
                        endGame(court.id, "A");
                        setEndingCourtId(null);
                      }}
                    >
                      {court.teamA && teamLabel(court.teamA)}
                    </button>
                    <button
                      className="btn btn-win"
                      onClick={() => {
                        endGame(court.id, "B");
                        setEndingCourtId(null);
                      }}
                    >
                      {court.teamB && teamLabel(court.teamB)}
                    </button>
                  </div>
                  <div className="end-actions">
                    <button
                      className="btn btn-ghost"
                      onClick={() => {
                        endGame(court.id, null);
                        setEndingCourtId(null);
                      }}
                    >
                      No result (void)
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => setEndingCourtId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
