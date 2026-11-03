import { createDigitValidator } from "../src/game";

describe("createDigitValidator", () => {
  it("should return a function", () => {
    const validator = createDigitValidator("dec");
    expect(typeof validator).toBe("function");
  });

  it("should validate decimal digits", () => {
    const validator = createDigitValidator("dec");
    expect(validator("5")).toBe(true);
    expect(validator("a")).toBe(false);
  });

  it("should validate binary digits", () => {
    const validator = createDigitValidator("bin");
    expect(validator("0")).toBe(true);
    expect(validator("1")).toBe(true);
    expect(validator("2")).toBe(false);
  });

  it("should be case-insensitive for hex", () => {
    const validator = createDigitValidator("hex");
    expect(validator("A")).toBe(true);
    expect(validator("a")).toBe(true);
    expect(validator("F")).toBe(true);
    expect(validator("f")).toBe(true);
    expect(validator("G")).toBe(false);
  });
});