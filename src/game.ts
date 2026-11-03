import { Base } from "./types";

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