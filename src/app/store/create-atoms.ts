import { atom } from "jotai";
import { TodoItem, FilterKind, LoadingKind } from "./types";

export const createAtoms = (initialItems: readonly TodoItem[]) => {
  const atoms = {
    /** (state) todo items */
    todoItems: atom<readonly TodoItem[]>(initialItems),
    /** (state) current filter */
    filter: atom<FilterKind>("all"),
    /** (state) loading state */
    loading: atom<LoadingKind | null>(null),
    /** (derived) filtered items */
    filteredItems: atom((get): readonly TodoItem[] => {
      const filter = get(atoms.filter);
      const items = get(atoms.todoItems);
      switch (filter) {
        case "all":
          return items;
        case "done":
          return items.filter((item) => item.done);
        case "undone":
          return items.filter((item) => !item.done);
      }
    }),
  } as const;
  return atoms;
};
