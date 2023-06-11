import { v4 as uuidV4 } from "uuid";
import { Store, createUpdateAtom } from "../../utils/jotai-helpers";
import { createAtoms } from "./create-atoms";
import { ExternalApi, Actions, LoadingKind } from "./types";

export const createActions = (
  atoms: ReturnType<typeof createAtoms>,
  store: Store,
  externalApi: ExternalApi
): Actions => {
  const updateAtom = createUpdateAtom(store);

  const wrapLoading = async (loading: LoadingKind, f: () => Promise<void>) => {
    if (store.get(atoms.loading) != null) {
      return; // do nothing if there is something on going.
    }
    try {
      store.set(atoms.loading, loading);
      await f();
    } finally {
      store.set(atoms.loading, null);
    }
  };

  return {
    addTodo: () => {
      updateAtom(atoms.todoItems, (draft) => {
        const id = uuidV4();
        draft.push({ id, text: "", done: false });
      });
    },
    toggleDone: (id) => {
      updateAtom(atoms.todoItems, (draft) => {
        for (const draftItem of draft) {
          if (draftItem.id === id) {
            draftItem.done = !draftItem.done;
          }
        }
      });
    },
    changeText: (id, text) => {
      updateAtom(atoms.todoItems, (draft) => {
        for (const draftItem of draft) {
          if (draftItem.id === id) {
            draftItem.text = text;
          }
        }
      });
    },
    deleteItem: (id) => {
      store.set(
        atoms.todoItems,
        store.get(atoms.todoItems).filter((item) => item.id !== id)
      );
    },
    deleteAllDoneItems: () => {
      store.set(
        atoms.todoItems,
        store.get(atoms.todoItems).filter((item) => !item.done)
      );
    },
    updateFilter: (kind) => store.set(atoms.filter, kind),
    save: () =>
      wrapLoading("saving", async () => {
        await externalApi.save(store.get(atoms.todoItems));
      }),
    load: () =>
      wrapLoading("loading", async () => {
        try {
          const data = await externalApi.load();
          store.set(atoms.todoItems, data);
        } catch (e) {
          externalApi.alert(`Error: fail to load.\n${e}`);
        }
      }),
  } as const;
};
