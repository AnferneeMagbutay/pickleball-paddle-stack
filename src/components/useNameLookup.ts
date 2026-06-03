import { useMemo } from "react";
import { useStore } from "../state/store";
import type { PlayerId } from "../lib/types";

export function useNameLookup(): (id: PlayerId) => string {
  const { state } = useStore();
  return useMemo(() => {
    const map = new Map(state.players.map((p) => [p.id, p.name]));
    return (id: PlayerId) => map.get(id) ?? "(removed)";
  }, [state.players]);
}
