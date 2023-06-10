import { atom } from "jotai";
import { TodoItem, FilterKind, LoadingKind } from "./types";

/** @package */
export const todoItemsAtom = atom<readonly TodoItem[]>([]);

/** @package */
export const filterAtom = atom<FilterKind>("all");

/**
 * @package
 * null = Nothing is loading.
 */
export const loadingAtom = atom<LoadingKind | null>(null);

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
