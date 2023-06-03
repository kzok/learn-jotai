import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Greeting } from "../greeting";

describe("Greeting", () => {
  it("shows greeting message.", async () => {
    render(<Greeting name="John" />);
    expect(await screen.findByText("Hello, John!")).not.toBeNull();
  });

  it("shows another greeting message.", async () => {
    render(<Greeting name="Bob" />);
    expect(await screen.findByText("Hello, Bob!")).not.toBeNull();
  });
});
