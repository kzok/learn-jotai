import { ControlSection } from "./control-section";
import { usePageInitialization } from "./store";
import { TodoList } from "./todo-list";

export const Page: React.FC = () => {
  const status = usePageInitialization();
  if (status === "pending") {
    return <p>loading</p>;
  }
  return (
    <>
      <h1>An example TODO app</h1>
      <hr />
      <ControlSection />
      <hr />
      <TodoList />
    </>
  );
};
