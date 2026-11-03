import { generateSecret } from "../src/game";

describe("generateSecret", () => {
  it("should generate secret of correct length", () => {
    const secret = generateSecret(4, "dec", () => 0);
    expect(secret.length).toBe(4);
  });

  it("should produce unique digits", () => {
    const secret = generateSecret(4, "dec", () => 0);
    const chars = secret.split("");
    const unique = new Set(chars);
    expect(unique.size).toBe(4);
  });

  it("should use only valid digits for base", () => {
    const secret = generateSecret(3, "bin", () => 0);
    expect(secret).toMatch(/^[01]+$/);
  });

  it("should be testable with deterministic random", () => {
    const random = (min: number, max: number) => 0;
    const secret = generateSecret(3, "dec", random);
    expect(secret).toBe("012");
  });

  it("should handle leading zeros", () => {
    const random = (min: number, max: number) => 0;
    const secret = generateSecret(4, "dec", random);
    expect(secret.startsWith("0")).toBe(true);
  });
});