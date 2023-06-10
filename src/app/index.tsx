import { ControlSection } from "./control-section";
import { TodoList } from "./todo-list";

export const Page: React.FC = () => (
  <>
    <h1>An example TODO app</h1>
    <hr />
    <ControlSection />
    <TodoList />
  </>
);
