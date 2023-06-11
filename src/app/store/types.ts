export type TodoItem = Readonly<{
  id: string;
  done: boolean;
  text: string;
}>;

export type LoadingKind = "saving" | "loading";

export type FilterKind = "all" | "undone" | "done";

export type ExternalApi = Readonly<{
  /**
   * save data to localStorage.
   * @param data
   * @returns
   */
  save: (data: readonly TodoItem[]) => Promise<void>;
  /**
   * load data from localStorage.
   * @returns
   */
  load: () => Promise<readonly TodoItem[]>;
  /**
   * show alert.
   * @param text
   * @returns
   */
  alert: (text: string) => void;
}>;

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
