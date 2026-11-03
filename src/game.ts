import { Base, GuessResult } from "./types";

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

export function countPossibleSecrets(length: number, base: Base): number {
  const key = `${length}-${base}`;
  if (possibleSecretsMemo.has(key)) return possibleSecretsMemo.get(key)!;
  const numericBase = getBaseValue(base);
  const helper = (n: number, k: number): number => {
    if (n <= 0) return 1;
    return k * helper(n - 1, k - 1);
  };
  const result = helper(length, numericBase);
  possibleSecretsMemo.set(key, result);
  return result;
}