import { v4 as uuidV4 } from "uuid";
import { Actions } from "./types";
import { todoItemsAtom, filterAtom } from "./atoms";
import { Store, createUpdateAtom } from "../../utils/jotai-helpers";

export const createActions = (store: Store): Actions => {
  const updateAtom = createUpdateAtom(store);
  return {
    addTodo: () => {
      updateAtom(todoItemsAtom, (draft) => {
        const id = uuidV4();
        draft.push({ id, text: "", done: false });
      });
    },
    toggleDone: (id) => {
      updateAtom(todoItemsAtom, (draft) => {
        for (const draftItem of draft) {
          if (draftItem.id === id) {
            draftItem.done = !draftItem.done;
          }
        }
      });
    },
    changeText: (id, text) => {
      updateAtom(todoItemsAtom, (draft) => {
        for (const draftItem of draft) {
          if (draftItem.id === id) {
            draftItem.text = text;
          }
        }
      });
    },
    deleteItem: (id) => {
      store.set(
        todoItemsAtom,
        store.get(todoItemsAtom).filter((item) => item.id !== id)
      );
    },
    deleteAllDoneItems: () => {
      store.set(
        todoItemsAtom,
        store.get(todoItemsAtom).filter((item) => !item.done)
      );
    },
    updateFilter: (kind) => store.set(filterAtom, kind),
  };
};
