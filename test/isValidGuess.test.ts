import { isValidGuess } from "../src/game";

describe("isValidGuess", () => {
  it("should accept valid guess", () => {
    expect(isValidGuess("1234", 4, "dec")).toBe(true);
  });

  it("should reject wrong length", () => {
    expect(isValidGuess("123", 4, "dec")).toBe(false);
  });

  it("should reject invalid digit", () => {
    expect(isValidGuess("12x4", 4, "dec")).toBe(false);
  });

  it("should reject duplicate digits", () => {
    expect(isValidGuess("1123", 4, "dec")).toBe(false);
  });

  it("should accept binary guess", () => {
    expect(isValidGuess("01", 2, "bin")).toBe(true);
  });

  it("should reject binary guess with wrong length", () => {
    expect(isValidGuess("010", 2, "bin")).toBe(false);
  });

  it("should accept hex with lowercase", () => {
    expect(isValidGuess("abcd", 4, "hex")).toBe(true);
  });

  it("should accept hex with uppercase", () => {
    expect(isValidGuess("ABCD", 4, "hex")).toBe(true);
  });

  it("should accept hex mixed case", () => {
    expect(isValidGuess("aBcD", 4, "hex")).toBe(true);
  });
});

