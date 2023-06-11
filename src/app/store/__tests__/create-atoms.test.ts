import { createStore } from "jotai";
import { describe, it, expect } from "vitest";
import { createAtoms } from "../create-atoms";
import { exampleTodoItems } from "./fixtures";

describe("filtered todo items", () => {
  describe(`if the filter is "all"`, () => {
    it("returns all items.", () => {
      const atoms = createAtoms(exampleTodoItems);
      const store = createStore();
      store.set(atoms.filter, "all");
      expect(store.get(atoms.filteredItems)).toStrictEqual([
        { id: "id1", done: false, text: "task#1" },
        { id: "id2", done: true, text: "task#2" },
      ]);
    });
  });

  describe(`if the filter is "done"`, () => {
    it("returns items whose `done` is true.", () => {
      const atoms = createAtoms(exampleTodoItems);
      const store = createStore();
      store.set(atoms.filter, "done");
      expect(store.get(atoms.filteredItems)).toStrictEqual([
        { id: "id2", done: true, text: "task#2" },
      ]);
    });
  });

  describe(`if the filter is "undone"`, () => {
    it("returns items whose `done` is false.", () => {
      const atoms = createAtoms(exampleTodoItems);
      const store = createStore();
      store.set(atoms.filter, "undone");
      expect(store.get(atoms.filteredItems)).toStrictEqual([
        { id: "id1", done: false, text: "task#1" },
      ]);
    });
  });
});
