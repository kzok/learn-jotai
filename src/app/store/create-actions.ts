import { v4 as uuidV4 } from "uuid";
import { z } from "zod";
import { Actions, LoadingKind } from "./types";
import { todoItemsAtom, filterAtom, loadingAtom } from "./atoms";
import { Store, createUpdateAtom } from "../../utils/jotai-helpers";

type ExternalApi = Readonly<{
  save: (data: string) => Promise<void>;
  load: () => Promise<string | null>;
  alert: (text: string) => void;
}>;

const dataSchema = z.array(
  z.object({
    id: z.string(),
    done: z.boolean(),
    text: z.string(),
  })
);

export const createActions = (
  store: Store,
  externalApi: ExternalApi
): Actions => {
  const updateAtom = createUpdateAtom(store);

  const wrapLoading = async (loading: LoadingKind, f: () => Promise<void>) => {
    if (store.get(loadingAtom) != null) {
      return; // do nothing if there is something on going.
    }
    try {
      store.set(loadingAtom, loading);
      await f();
    } finally {
      store.set(loadingAtom, null);
    }
  };

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
    save: () =>
      wrapLoading("saving", async () => {
        await externalApi.save(JSON.stringify(store.get(todoItemsAtom)));
      }),
    load: () =>
      wrapLoading("loading", async () => {
        try {
          const rawData = await externalApi.load();
          if (rawData == null) {
            return;
          }
          store.set(todoItemsAtom, dataSchema.parse(JSON.parse(rawData)));
        } catch (e) {
          externalApi.alert(`Error: fail to load.\n${e}`);
        }
      }),
  };
};
