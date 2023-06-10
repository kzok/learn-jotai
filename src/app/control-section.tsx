import { FilterKind, useActions, useFilter } from "./store";
import { memo } from "react";
import styles from "./control-section.module.scss";

const filterKindPair: readonly Readonly<{
  kind: FilterKind;
  text: string;
}>[] = [
  { kind: "all", text: "show all" },
  { kind: "undone", text: "show undone only" },
  { kind: "done", text: "show done only" },
];

const FilterRow: React.FC = () => {
  const currentFilter = useFilter();
  const { updateFilter } = useActions();
  return (
    <div className={styles["row"]}>
      {filterKindPair.map(({ kind, text }) => (
        <label key={kind}>
          <input
            type="radio"
            name="filter"
            checked={currentFilter === kind}
            onChange={() => updateFilter(kind)}
          />
          {text}
        </label>
      ))}
    </div>
  );
};

export const ControlSection: React.FC = memo(() => {
  const { addTodo, deleteAllDoneItems } = useActions();
  return (
    <>
      <div className={styles["row"]}>
        <button onClick={addTodo}>Add item</button>
        <button onClick={deleteAllDoneItems}>Delete all done</button>
      </div>
      <FilterRow />
    </>
  );
});
