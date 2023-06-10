import { useTodoItems, useActions, TodoItem } from "./store";
import { memo, useMemo } from "react";
import styles from "./todo-list.module.scss";

const TodoItemRow: React.FC<{ item: TodoItem }> = memo(({ item }) => {
  const { toggleDone, changeText, deleteItem } = useActions();
  const disabledText = useMemo((): boolean => item.done, [item]);
  return (
    <div className={styles["item"]}>
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => toggleDone(item.id)}
      />
      <input
        className={styles["textInput"]}
        type="text"
        placeholder="new todo item."
        disabled={disabledText}
        value={item.text}
        onChange={(e) => changeText(item.id, e.target.value)}
      />
      <button
        className={styles["deleteButton"]}
        onClick={() => deleteItem(item.id)}
      >
        delete
      </button>
    </div>
  );
});

export const TodoList: React.FC = memo(() => {
  const todoItems = useTodoItems();
  if (todoItems.length === 0) {
    return <p>There is no item.</p>;
  }
  return (
    <div>
      {todoItems.map((item) => (
        <TodoItemRow key={item.id} item={item} />
      ))}
    </div>
  );
});
