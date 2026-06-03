export type PlayerId = string;

export interface Player {
  id: PlayerId;
  name: string;
}

export interface PlayerStats {
  wins: number;
  losses: number;
  games: number;
}

export type CourtStatus = "open" | "playing";

export type Team = [PlayerId, PlayerId];

export interface Court {
  id: number;
  status: CourtStatus;
  teamA: Team | null;
  teamB: Team | null;
}

export interface AppState {
  version: number;
  players: Player[];
  queue: PlayerId[];
  courts: Court[];
  stats: Record<PlayerId, PlayerStats>;
}

export type GameOutcome = "A" | "B" | null;
