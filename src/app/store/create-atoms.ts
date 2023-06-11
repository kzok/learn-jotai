import { atom } from "jotai";
import { TodoItem, FilterKind, LoadingKind } from "./types";

export const createAtoms = (initialItems: readonly TodoItem[]) => {
  const atoms = {
    todoItems: atom<readonly TodoItem[]>(initialItems),
    filter: atom<FilterKind>("all"),
    loading: atom<LoadingKind | null>(null),
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
