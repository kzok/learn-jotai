import { Getter, Setter } from "jotai";

export type Store = Readonly<{
  get: Getter;
  set: Setter;
}>;
