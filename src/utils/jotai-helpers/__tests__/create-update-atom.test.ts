import { atom, createStore } from "jotai";
import { describe, it, expect } from "vitest";
import { createUpdateAtom } from "../create-update-atom";

describe(createUpdateAtom.name, () => {
  const exampleAtom = atom({ foo: "foo", bar: "bar" });

  it("updates atom value.", () => {
    const store = createStore();
    const updateAtom = createUpdateAtom(store);
    const oldValue = store.get(exampleAtom);
    updateAtom(exampleAtom, (draft) => {
      draft.foo = "baz";
    });
    expect(oldValue).toStrictEqual({ foo: "foo", bar: "bar" });
    expect(store.get(exampleAtom)).toStrictEqual({ foo: "baz", bar: "bar" });
  });

  it("ignores returned value.", () => {
    const store = createStore();
    const updateAtom = createUpdateAtom(store);
    updateAtom(exampleAtom, () => ({ foo: "baz", bar: "quux" }));
    expect(store.get(exampleAtom)).toStrictEqual({ foo: "foo", bar: "bar" });
  });
});
