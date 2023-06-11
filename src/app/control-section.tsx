import { memo } from "react";
import styles from "./control-section.module.scss";
import { FilterKind, useActions, useFilter, useLoadingStatus } from "./store";

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
  const { addTodo, deleteAllDoneItems, save, load } = useActions();
  const loading = useLoadingStatus();
  const disabled = loading != null;

  return (
    <>
      <div className={styles["row"]}>
        <button
          onClick={addTodo}
          disabled={disabled}
          title="add item to todo list"
        >
          Add
        </button>
        <button
          onClick={deleteAllDoneItems}
          disabled={disabled}
          title="delete all done items"
        >
          Delete done
        </button>
        <button
          onClick={save}
          disabled={disabled}
          title="save items to localStorage"
        >
          {loading === "saving" ? "Saving..." : "Save"}
        </button>
        <button
          onClick={load}
          disabled={disabled}
          title="load items from localStorage"
        >
          {loading === "loading" ? "Loading..." : "Load"}
        </button>
      </div>
      <FilterRow />
    </>
  );
});
