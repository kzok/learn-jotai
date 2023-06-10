import { atom } from "jotai";
import { useAtomValue, useSetAtom, useStore } from "jotai/react";
import { Actions } from "./types";
import { filterAtom, filteredItemsAtom } from "./atoms";
import { createActions } from "./create-actions";

export const useFilteredTodoItems = () => useAtomValue(filteredItemsAtom);

export const useFilter = () => useAtomValue(filterAtom);

const actionsAtom = atom<Actions | null>(null);
export const useActions = (): Actions => {
  let value = useAtomValue(actionsAtom);
  const setValue = useSetAtom(actionsAtom);
  const store = useStore();
  if (value == null) {
    value = createActions(store);
    setValue(value);
  }
  return value;
};
