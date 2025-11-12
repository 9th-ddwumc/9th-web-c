import "../App.css";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { useTodo } from "../context/TodoContext";

const Todo = () => {
  // useTodo 훅으로 전역 상태와 함수 가져오기
  const { input, setInput, todos, doneTasks, addTodo, completeTask, deleteTask } = useTodo();

  return (
    <div className="todo-container">
      <h1 className="todo-container__header">LIVI TODO</h1>

      {/* TodoForm은 props 없이 상태를 useTodo로 바로 사용 */}
      <TodoForm />

      <div className="render-container">
        {/* 할 일 목록 */}
        <TodoList
          tasks={todos}
          title="할 일"
          buttonText="완료"
          buttonColor="#28a745"
          buttonAction={completeTask}
        />

        {/* 완료 목록 */}
        <TodoList
          tasks={doneTasks}
          title="해낸 일"
          buttonText="삭제"
          buttonColor="#dc3545"
          buttonAction={deleteTask}
        />
      </div>
    </div>
  );
};

export default Todo;