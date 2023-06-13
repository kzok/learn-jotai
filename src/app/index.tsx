import { useState } from "react";
import { ControlSection } from "./control-section";
import styles from "./index.module.scss";
import { StoreProvider } from "./store";
import { TodoList } from "./todo-list";

const AppContent: React.FC = () => (
  <StoreProvider fallback={<p>loading</p>}>
    <hr />
    <ControlSection />
    <hr />
    <TodoList />
  </StoreProvider>
);

export const Page: React.FC = () => {
  const [mount, setMount] = useState(true);
  const reset = async () => {
    if (!mount) {
      return;
    }
    setMount(false);
    await new Promise<void>((done) => setTimeout(done, 100));
    setMount(true);
  };
  return (
    <>
      <div className={styles["container"]}>
        <h1>An example TODO App</h1>
        <button
          disabled={!mount}
          onClick={reset}
          title="remount app to test cleanup"
        >
          remount App
        </button>
      </div>
      {mount && <AppContent />}
    </>
  );
};
