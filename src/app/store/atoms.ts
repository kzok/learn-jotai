import { atom } from "jotai";
import { TodoItem } from "./types";

export const todoAtom = atom<readonly TodoItem[]>([]);
