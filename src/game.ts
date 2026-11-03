import { Base, GameState, GuessEntry, GuessResult, ScoreEntry } from "./types";

const BASE_DIGITS: Record<Base, string> = {
  bin: "01",
  oct: "01234567",
  dec: "0123456789",
  hex: "0123456789abcdef",
};

export function getDigits(base: Base): string {
  return BASE_DIGITS[base];
}

export function generateSecret(
  length: number,
  base: Base,
  random: (min?: number, max?: number) => number = Math.random
): string {
  const digits = getDigits(base).split("");
  const pick = (remaining: string[], acc: string[]): string => {
    if (acc.length >= length) return acc.join("");
    const idx = Math.floor(random() * remaining.length);
    const next = remaining.filter((_, i) => i !== idx);
    return pick(next, [...acc, remaining[idx]]);
  };
  return pick(digits, []);
}
export function evaluateGuess(secret: string, guess: string): GuessResult {
  const s = secret.toLowerCase();
  const g = guess.toLowerCase();
  const secretChars = s.split("");
  const guessChars = g.split("");

  const bulls = secretChars.reduce((acc, ch, i) => (ch === guessChars[i] ? acc + 1 : acc), 0);

  const unmatchedSecret = secretChars.filter((ch, i) => ch !== guessChars[i]);
  const unmatchedGuess = guessChars.filter((ch, i) => ch !== secretChars[i]);

  const remaining = unmatchedGuess.reduce((pool, ch) => {
    const idx = pool.indexOf(ch);
    if (idx === -1) return pool;
    return [...pool.slice(0, idx), ...pool.slice(idx + 1)];
  }, unmatchedSecret);

  const cows = unmatchedSecret.length - remaining.length;

  return { bulls, cows };
}
export function createDigitValidator(base: Base): (char: string) => boolean {
  const digits = getDigits(base).toLowerCase();
  return (char: string) => digits.includes(char.toLowerCase());
}
export function isValidGuess(guess: string, length: number, base: Base): boolean {
  if (guess.length !== length) return false;
  const validator = createDigitValidator(base);
  const lowered = guess.toLowerCase().split("");
  if (lowered.some((ch) => !validator(ch))) return false;
  return new Set(lowered).size === lowered.length;
}
export function getBaseValue(base: Base): number {
  return getDigits(base).length;
}

const possibleSecretsMemo = new Map<string, number>();

export function countPossibleSecrets(length: number, base: Base): number;
export function countPossibleSecrets(length: number, base: number): number;
export function countPossibleSecrets(length: number, base: Base | number): number {
  if (typeof base === "string") {
    const key = `${length}-${base}`;
    if (possibleSecretsMemo.has(key)) return possibleSecretsMemo.get(key)!;
    const result = countPossibleSecrets(length, getBaseValue(base));
    possibleSecretsMemo.set(key, result);
    return result;
  }
  if (length <= 0) return 1;
  return base * countPossibleSecrets(length - 1, base - 1);
}
export function makeEntry(guess: string, secret: string): GuessEntry {
  const { bulls, cows } = evaluateGuess(secret, guess);
  return { guess, bulls, cows };
}

export function addGuess(state: GameState, guess: string): GameState {
  const entry = makeEntry(guess, state.secret);
  return {
    ...state,
    history: [...state.history, entry],
    attempts: state.attempts + 1,
    status: entry.bulls === state.length ? "won" : state.status,
  };
}

export function startGame(length: number, base: Base, random: (min?: number, max?: number) => number): GameState {
  return {
    secret: generateSecret(length, base, random),
    length,
    base,
    history: [],
    status: "playing",
    attempts: 0,
    startTime: Date.now(),
  };
}

export function getScoreKey(entry: ScoreEntry): string {
  return `${entry.length}-${entry.base}`;
}

export function loadScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem("bullsAndCowsScores");
    if (!raw) return [];
    return JSON.parse(raw) as ScoreEntry[];
  } catch {
    return [];
  }
}

export function saveScores(scores: ScoreEntry[]): void {
  localStorage.setItem("bullsAndCowsScores", JSON.stringify(scores));
}

export function addScore(entry: ScoreEntry): ScoreEntry[] {
  const scores = loadScores();
  const next = [...scores, entry];
  next.sort((a, b) => {
    if (a.attempts !== b.attempts) return a.attempts - b.attempts;
    return a.time - b.time;
  });
  const top = next.slice(0, 10);
  saveScores(top);
  return top;
}

export function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}