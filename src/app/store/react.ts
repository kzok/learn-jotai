import { atom } from "jotai";
import { useAtomValue, useStore } from "jotai/react";
import { useMemo } from "react";
import { filterAtom, filteredItemsAtom, loadingAtom } from "./atoms";
import { createActions } from "./create-actions";
import { Actions } from "./types";

const LOCAL_STORAGE_KEY = "TODO_APP_DATA";

const sleep = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));

const actionsAtom = atom<Actions | null>(null);

export const usePageInitialization = (): "pending" | "done" => {
  const store = useStore();
  const actions = useMemo(
    () =>
      createActions(store, {
        save: async (data) => {
          // simulate network delay
          await sleep(1000);
          window.localStorage.setItem(LOCAL_STORAGE_KEY, data);
        },
        load: async () => {
          // simulate network delay
          await sleep(1000);
          return window.localStorage.getItem(LOCAL_STORAGE_KEY);
        },
        alert: (text) => void window.alert(text),
      }),
    []
  );
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

export const useLoadingStatus = () => useAtomValue(loadingAtom);
