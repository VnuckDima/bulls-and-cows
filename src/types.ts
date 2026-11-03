export type Base = "bin" | "oct" | "dec" | "hex";

export type GameStatus = "settings" | "playing" | "won";

export interface GuessResult {
  bulls: number;
  cows: number;
}

export interface GuessEntry {
  guess: string;
  bulls: number;
  cows: number;
}

export interface GameState {
  secret: string;
  length: number;
  base: Base;
  history: GuessEntry[];
  status: GameStatus;
  attempts: number;
  startTime: number | null;
}

export interface ScoreEntry {
  length: number;
  base: Base;
  attempts: number;
  time: number;
  date: string;
}