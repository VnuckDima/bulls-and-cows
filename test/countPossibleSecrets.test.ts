import { countPossibleSecrets } from "../src/game";

describe("countPossibleSecrets", () => {
  it("should return 2 for length 2, base 2 (P(2,2)=2)", () => {
    expect(countPossibleSecrets(2, "bin")).toBe(2);
  });

  it("should return 10 for length 1, base 10", () => {
    expect(countPossibleSecrets(1, "dec")).toBe(10);
  });

  it("should return 90 for length 2, base 10 (10*9)", () => {
    expect(countPossibleSecrets(2, "dec")).toBe(90);
  });

  it("should return 720 for length 3, base 10 (10*9*8)", () => {
    expect(countPossibleSecrets(3, "dec")).toBe(720);
  });

  it("should return 5040 for length 4, base 10 (10*9*8*7)", () => {
    expect(countPossibleSecrets(4, "dec")).toBe(5040);
  });

  it("should work for hex base: length 2, base 16 -> 16*15=240", () => {
    expect(countPossibleSecrets(2, "hex")).toBe(240);
  });

  it("should return 1 when length equals base (permutations of all digits)", () => {
    expect(countPossibleSecrets(8, "oct")).toBe(40320);
  });

  it("should be memoized (returns same value, no recomputation side effects)", () => {
    const start = performance.now();
    countPossibleSecrets(6, "hex");
    countPossibleSecrets(6, "hex");
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });
});