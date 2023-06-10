export type TodoItem = Readonly<{
  id: string;
  done: boolean;
  text: string;
}>;

export type LoadingKind = "saving" | "loading";

export type FilterKind = "all" | "undone" | "done";

export type Actions = Readonly<{
  /** add todo item */
  addTodo: () => void;
  /**
   * @param id todo item ID
   * @returns
   */
  toggleDone: (id: string) => void;
  /**
   * @param id todo item ID
   * @param text text
   * @returns
   */
  changeText: (id: string, text: string) => void;
  /**
   * @param id todo item ID
   * @returns
   */
  deleteItem: (id: string) => void;
  /** delete all done items */
  deleteAllDoneItems: () => void;
  /**
   * @param kind filter kind to update
   * @returns
   */
  updateFilter: (kind: FilterKind) => void;
  /** save current state to localStorage. */
  save: () => Promise<void>;
  /** load current state from localStorage. */
  load: () => Promise<void>;
}>;
