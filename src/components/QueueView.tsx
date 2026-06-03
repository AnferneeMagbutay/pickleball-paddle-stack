import { useState, type FormEvent } from "react";
import { isOnCourt } from "../lib/engine";
import { useStore } from "../state/store";
import { useNameLookup } from "./useNameLookup";

export function QueueView() {
  const { state, addPlayer, removePlayer, moveInQueue } = useStore();
  const nameOf = useNameLookup();
  const [name, setName] = useState("");

  const onAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addPlayer(name);
    setName("");
  };

  const onCourt = state.players.filter((p) => isOnCourt(state, p.id));

  return (
    <div className="queue">
      <form className="add-row" onSubmit={onAdd}>
        <input
          className="text-input"
          value={name}
          placeholder="Add player name"
          onChange={(e) => setName(e.target.value)}
          aria-label="Player name"
        />
        <button
          className="btn btn-primary"
          type="submit"
          disabled={!name.trim()}
        >
          Add
        </button>
      </form>

      {onCourt.length > 0 && (
        <section className="queue-section">
          <h2 className="section-title">On court</h2>
          <ul className="queue-list">
            {onCourt.map((p) => (
              <li key={p.id} className="queue-row queue-row-playing">
                <span className="player-name">{p.name}</span>
                <span className="tag">playing</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="queue-section">
        <h2 className="section-title">Up next</h2>
        {state.queue.length === 0 ? (
          <p className="hint">Queue is empty.</p>
        ) : (
          <ul className="queue-list">
            {state.queue.map((id, index) => (
              <li key={id} className="queue-row">
                <span className="pos">{index + 1}</span>
                <span className="player-name">{nameOf(id)}</span>
                <span className="row-actions">
                  <button
                    className="icon-btn"
                    aria-label="Move up"
                    disabled={index === 0}
                    onClick={() => moveInQueue(id, index - 1)}
                  >
                    ↑
                  </button>
                  <button
                    className="icon-btn"
                    aria-label="Move down"
                    disabled={index === state.queue.length - 1}
                    onClick={() => moveInQueue(id, index + 1)}
                  >
                    ↓
                  </button>
                  <button
                    className="icon-btn"
                    aria-label="Move to back"
                    disabled={index === state.queue.length - 1}
                    onClick={() => moveInQueue(id, state.queue.length)}
                  >
                    ⤓
                  </button>
                  <button
                    className="icon-btn icon-danger"
                    aria-label="Remove player"
                    onClick={() => removePlayer(id)}
                  >
                    ✗
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
