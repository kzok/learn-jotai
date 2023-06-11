import { useStore } from "jotai/react";
import { createContext, useContext } from "react";
import { useAsync } from "react-use";
import { z } from "zod";
import { ReadonlyAtoms } from "../../utils/jotai-helpers";
import { createActions } from "./create-actions";
import { createAtoms } from "./create-atoms";
import { ExternalApi } from "./types";

const dataSchema = z.array(
  z.object({
    id: z.string(),
    done: z.boolean(),
    text: z.string(),
  })
);

const LOCAL_STORAGE_KEY = "TODO_APP_DATA";

const sleep = (ms: number) => new Promise<void>((done) => setTimeout(done, ms));

type ContextValue = Readonly<{
  atoms: ReadonlyAtoms<ReturnType<typeof createAtoms>>;
  actions: ReturnType<typeof createActions>;
}>;

const context = createContext<ContextValue | null>(null);

export const ScopeProvider: React.FC<{
  fallback: React.ReactNode;
  children: React.ReactNode;
}> = (props) => {
  const store = useStore();
  const state = useAsync(async (): Promise<ContextValue> => {
    const externalApi: ExternalApi = {
      save: async (data) => {
        // simulate network delay
        await sleep(1000);
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      },
      load: async () => {
        // simulate network delay
        await sleep(1000);
        const data = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (data == null) {
          return [];
        }
        return dataSchema.parse(JSON.parse(data));
      },
      alert: (text) => void window.alert(text),
    };
    const atoms = createAtoms(await externalApi.load());
    const actions = createActions(atoms, store, externalApi);
    return { atoms, actions };
  }, []);
  if (state.error) {
    throw state.error;
  }
  if (state.loading || state.value == null) {
    return props.fallback;
  }
  return (
    <context.Provider value={state.value}>{props.children}</context.Provider>
  );
};

const useContextValue = (): ContextValue => {
  let value = useContext(context);
  if (value == null) {
    throw new Error("Component must be wrapped with <context.Provider>");
  }
  return value;
};

export const useActions = (): ContextValue["actions"] =>
  useContextValue().actions;

export const useScopedAtoms = (): ContextValue["atoms"] =>
  useContextValue().atoms;
