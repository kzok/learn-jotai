import * as immer from "immer";
import { createStore } from "jotai";
import { describe, it, expect, vitest } from "vitest";
import { createActions } from "../create-actions";
import { createAtoms } from "../create-atoms";
import { ExternalApi, TodoItem } from "../types";
import { exampleTodoItems } from "./fixtures";

const notImplemented = (): never => {
  throw new Error("not implemented.");
};
const emptyExternalApi: ExternalApi = {
  save: notImplemented,
  load: notImplemented,
  alert: notImplemented,
};

describe("add todo item", () => {
  it("adds an empty todo item.", () => {
    const store = createStore();
    const atoms = createAtoms([]);
    const actions = createActions(atoms, store, emptyExternalApi);
    expect(store.get(atoms.todoItems)).toStrictEqual([]);
    actions.addTodo();
    expect(store.get(atoms.todoItems)).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          text: "",
          done: false,
        }),
      ])
    );
  });
});

describe("toggle todo item done", () => {
  it("toggles the todo item done state.", () => {
    const store = createStore();
    const atoms = createAtoms(exampleTodoItems);
    const actions = createActions(atoms, store, emptyExternalApi);
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id1", done: false, text: "task#1" },
      { id: "id2", done: true, text: "task#2" },
    ]);
    actions.toggleDone("id1");
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id1", done: true, text: "task#1" },
      { id: "id2", done: true, text: "task#2" },
    ]);
    actions.toggleDone("id1");
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id1", done: false, text: "task#1" },
      { id: "id2", done: true, text: "task#2" },
    ]);
    actions.toggleDone("id2");
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id1", done: false, text: "task#1" },
      { id: "id2", done: false, text: "task#2" },
    ]);
  });
});

describe("change todo item text", () => {
  it("changes the todo item text.", () => {
    const store = createStore();
    const atoms = createAtoms(exampleTodoItems);
    const actions = createActions(atoms, store, emptyExternalApi);
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id1", done: false, text: "task#1" },
      { id: "id2", done: true, text: "task#2" },
    ]);
    actions.changeText("id1", "foo");
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id1", done: false, text: "foo" },
      { id: "id2", done: true, text: "task#2" },
    ]);
    actions.changeText("id2", "bar");
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id1", done: false, text: "foo" },
      { id: "id2", done: true, text: "bar" },
    ]);
  });
});

describe("delete todo item", () => {
  it("deletes the todo item.", () => {
    const store = createStore();
    const atoms = createAtoms(exampleTodoItems);
    const actions = createActions(atoms, store, emptyExternalApi);
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id1", done: false, text: "task#1" },
      { id: "id2", done: true, text: "task#2" },
    ]);
    actions.deleteItem("id1");
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id2", done: true, text: "task#2" },
    ]);

    actions.deleteItem("id2");
    expect(store.get(atoms.todoItems)).toStrictEqual([]);
  });
});

describe("delete all done items", () => {
  it("deletes all done items.", () => {
    const store = createStore();
    const atoms = createAtoms(exampleTodoItems);
    const actions = createActions(atoms, store, emptyExternalApi);
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id1", done: false, text: "task#1" },
      { id: "id2", done: true, text: "task#2" },
    ]);
    actions.deleteAllDoneItems();
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id1", done: false, text: "task#1" },
    ]);
  });
});

describe("update filter", () => {
  it("updates the current filter.", () => {
    const store = createStore();
    const atoms = createAtoms([]);
    const actions = createActions(atoms, store, emptyExternalApi);
    expect(store.get(atoms.filter)).toBe("all");
    actions.updateFilter("done");
    expect(store.get(atoms.filter)).toBe("done");
    actions.updateFilter("undone");
    expect(store.get(atoms.filter)).toBe("undone");
  });
});

describe("save", () => {
  it("serializes todo items into JSON string.", async () => {
    const store = createStore();
    const externalApi = immer.produce(emptyExternalApi, (draft) => {
      draft.save = vitest.fn();
    });
    const atoms = createAtoms(exampleTodoItems);
    const actions = createActions(atoms, store, externalApi);
    expect(store.get(atoms.todoItems)).toStrictEqual([
      { id: "id1", done: false, text: "task#1" },
      { id: "id2", done: true, text: "task#2" },
    ]);
    await actions.save();
    expect(externalApi.save).toHaveBeenCalledTimes(1);
    expect(externalApi.save).toHaveBeenNthCalledWith(1, [
      { id: "id1", done: false, text: "task#1" },
      { id: "id2", done: true, text: "task#2" },
    ]);
  });

  it(`loading state becomes "saving" while saving.`, async () => {
    const store = createStore();
    let promiseResolve: (() => void) | undefined;
    const externalApi = immer.produce(emptyExternalApi, (draft) => {
      draft.save = () =>
        new Promise<void>((resolve) => {
          promiseResolve = resolve;
        });
    });
    const atoms = createAtoms([]);
    const actions = createActions(atoms, store, externalApi);
    expect(store.get(atoms.loading)).toBeNull();
    const savePromise = actions.save();
    expect(store.get(atoms.loading)).toBe("saving");
    promiseResolve?.();
    await savePromise;
    expect(store.get(atoms.loading)).toBeNull();
  });
});

describe("load", () => {
  it("parses JSON string into todo items.", async () => {
    const store = createStore();
    const loadResult: readonly TodoItem[] = [
      { id: "id3", done: false, text: "task#3" },
      { id: "id4", done: true, text: "task#4" },
    ];
    const externalApi = immer.produce(emptyExternalApi, (draft) => {
      draft.load = vitest.fn(async () => loadResult);
    });
    const atoms = createAtoms([]);
    const actions = createActions(atoms, store, externalApi);
    expect(store.get(atoms.todoItems)).toStrictEqual([]);
    await actions.load();
    expect(externalApi.load).toHaveBeenCalledTimes(1);
    expect(store.get(atoms.todoItems)).toStrictEqual(loadResult);
  });

  it(`loading state becomes "loading" while loading.`, async () => {
    const store = createStore();
    let promiseResolve: (() => void) | undefined;
    const externalApi = immer.produce(emptyExternalApi, (draft) => {
      draft.load = () =>
        new Promise((resolve) => {
          promiseResolve = () => resolve([]);
        });
    });
    const atoms = createAtoms([]);
    const actions = createActions(atoms, store, externalApi);
    expect(store.get(atoms.loading)).toBeNull();
    const loadPromise = actions.load();
    expect(store.get(atoms.loading)).toBe("loading");
    promiseResolve?.();
    await loadPromise;
    expect(store.get(atoms.loading)).toBeNull();
  });
});
