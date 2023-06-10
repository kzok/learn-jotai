import { produce, Draft } from "immer";
import { PrimitiveAtom } from "jotai";
import { Store } from "./types";

/**
 * @param store jotai store
 * @returns function to update primitive atom value
 */
export const createUpdateAtom =
  (store: Store) =>
  <Value>(
    atom: PrimitiveAtom<Value>,
    recipe: (draft: Draft<Value>) => void
  ) => {
    const oldValue = store.get(atom);
    const newValue = produce(oldValue, (draft) => void recipe(draft));
    store.set(atom, newValue);
  };
