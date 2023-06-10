export type TodoItem = Readonly<{
  id: string;
  done: boolean;
  text: string;
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
}>;
