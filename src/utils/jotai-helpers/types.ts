import { Getter, Setter, Atom } from "jotai";

export type Store = Readonly<{
  get: Getter;
  set: Setter;
}>;

/** make all jotai atoms in objects/arrays read-only */
export type ReadonlyAtoms<T> = T extends Atom<infer Value>
  ? Atom<Value>
  : T extends Record<string, unknown> | [...unknown[]]
  ? { readonly [K in keyof T]: ReadonlyAtoms<T[K]> }
  : never;
