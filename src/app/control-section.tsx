import { useActions } from "./store";
import { memo } from "react";
import styles from "./control-section.module.scss";

export const ControlSection: React.FC = memo(() => {
  const { addTodo } = useActions();
  return (
    <div className={styles["section"]}>
      <button onClick={addTodo}>Add item</button>
    </div>
  );
});
