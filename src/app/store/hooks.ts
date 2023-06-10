import { atom } from "jotai";
import { useAtomValue, useSetAtom, useStore } from "jotai/react";
import { TodoItem, Actions } from "./types";
import { todoAtom } from "./atoms";
import { createActions } from "./create-actions";

export const useTodoItems = (): readonly TodoItem[] => useAtomValue(todoAtom);

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
