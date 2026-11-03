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