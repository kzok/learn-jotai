import { atom } from "jotai";
import { useAtomValue, useStore } from "jotai/react";
import { useMemo } from "react";
import { Actions } from "./types";
import { filterAtom, filteredItemsAtom } from "./atoms";
import { createActions } from "./create-actions";

const actionsAtom = atom<Actions | null>(null);

export const usePageInitialization = (): "pending" | "done" => {
  const store = useStore();
  const actions = useMemo(() => createActions(store), []);
  // sync actions
  if (store.get(actionsAtom) !== actions) {
    store.set(actionsAtom, actions);
  }
  return "done";
};

export const useActions = (): Actions => {
  let value = useAtomValue(actionsAtom);
  if (value == null) {
    throw new Error("cannot use actions before initialization.");
  }
  return value;
};

export const useFilteredTodoItems = () => useAtomValue(filteredItemsAtom);

export const useFilter = () => useAtomValue(filterAtom);
