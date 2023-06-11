import { useAtomValue } from "jotai/react";
import { memo, useMemo } from "react";
import { useActions, TodoItem, useScopedAtoms } from "./store";
import styles from "./todo-list.module.scss";

const TodoItemRow: React.FC<{ item: TodoItem }> = memo(({ item }) => {
  const { toggleDone, changeText, deleteItem } = useActions();
  const atoms = useScopedAtoms();
  const loading = useAtomValue(atoms.loading);
  const disabled = loading != null;
  const disabledText = useMemo(
    (): boolean => item.done || disabled,
    [item, disabled]
  );
  return (
    <div className={styles["item"]}>
      <input
        type="checkbox"
        checked={item.done}
        disabled={disabled}
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
        disabled={disabled}
        onClick={() => deleteItem(item.id)}
      >
        delete
      </button>
    </div>
  );
});

export const TodoList: React.FC = memo(() => {
  const atoms = useScopedAtoms();
  const todoItems = useAtomValue(atoms.filteredItems);
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
