import { v4 as uuidV4 } from "uuid";
import { Actions } from "./types";
import { todoAtom } from "./atoms";
import { Store, createUpdateAtom } from "../../utils/jotai-helpers";

export const createActions = (store: Store): Actions => {
  const updateAtom = createUpdateAtom(store);
  return {
    addTodo: () => {
      updateAtom(todoAtom, (draft) => {
        const id = uuidV4();
        draft.push({ id, text: "", done: false });
      });
    },
    toggleDone: (id) => {
      updateAtom(todoAtom, (draft) => {
        for (const draftItem of draft) {
          if (draftItem.id === id) {
            draftItem.done = !draftItem.done;
          }
        }
      });
    },
    changeText: (id, text) => {
      updateAtom(todoAtom, (draft) => {
        for (const draftItem of draft) {
          if (draftItem.id === id) {
            draftItem.text = text;
          }
        }
      });
    },
    deleteItem: (id) => {
      store.set(
        todoAtom,
        store.get(todoAtom).filter((item) => item.id !== id)
      );
    },
  };
};
