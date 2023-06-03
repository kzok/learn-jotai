import { describe, it, expect } from "vitest";
import { greet } from "../greet";

describe("greet", () => {
  it("greets", () => {
    expect(greet("John")).toBe("Hello, John!");
  });
});
