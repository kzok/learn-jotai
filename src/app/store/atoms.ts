import { atom } from "jotai";
import { TodoItem, FilterKind } from "./types";

export const todoItemsAtom = atom<readonly TodoItem[]>([]);

export const filterAtom = atom<FilterKind>("all");

export const filteredItemsAtom = atom((get): readonly TodoItem[] => {
  const filter = get(filterAtom);
  const items = get(todoItemsAtom);
  switch (filter) {
    case "all":
      return items;
    case "done":
      return items.filter((item) => item.done);
    case "undone":
      return items.filter((item) => !item.done);
  }
});
