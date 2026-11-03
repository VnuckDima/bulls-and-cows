import { evaluateGuess } from "../src/game";

describe("evaluateGuess", () => {
  it("should return 0 bulls and 0 cows for no matches", () => {
    const result = evaluateGuess("1234", "5678");
    expect(result.bulls).toBe(0);
    expect(result.cows).toBe(0);
  });

  it("should count all bulls when exact match", () => {
    const result = evaluateGuess("1234", "1234");
    expect(result.bulls).toBe(4);
    expect(result.cows).toBe(0);
  });

  it("should count cows when digits present but in wrong positions", () => {
    const result = evaluateGuess("1234", "4321");
    expect(result.bulls).toBe(0);
    expect(result.cows).toBe(4);
  });

  it("should handle mixed bulls and cows", () => {
    const result = evaluateGuess("1234", "1243");
    expect(result.bulls).toBe(2);
    expect(result.cows).toBe(2);
  });

  it("should not double-count matched digits", () => {
    const result = evaluateGuess("1123", "1111");
    expect(result.bulls).toBe(2);
    expect(result.cows).toBe(0);
  });

  it("should be case-insensitive for hex", () => {
    const result = evaluateGuess("abcd", "ABCD");
    expect(result.bulls).toBe(4);
    expect(result.cows).toBe(0);
  });

  it("should handle partial hex case", () => {
    const result = evaluateGuess("abcd", "aBcD");
    expect(result.bulls).toBe(4);
    expect(result.cows).toBe(0);
  });
});