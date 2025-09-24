import { useTodo } from "../context/TodoContext";

const TodoForm = () => {
  const { input, setInput, addTodo } = useTodo();

  return (
    <div className="todo-container__form">
      <input
        className="todo-container__input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="할 일 입력"
      />
      <button className="todo-container__button" onClick={() => addTodo(input)}>
        할 일 추가
      </button>
    </div>
  );
};

export default TodoForm;