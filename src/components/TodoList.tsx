import type { Task } from "../types/Task";

type TodoListProps = {
  title: string;
  tasks: Task[];
  buttonText: string;
  buttonColor: string;
  buttonAction: (task: Task) => void;
};

const TodoList = ({ title, tasks, buttonText, buttonColor, buttonAction }: TodoListProps) => {
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <ul className="render-container__list">
        {tasks.map((task) => (
          <li key={task.id} className="render-container__item">
            <span className="render-container__item-text">{task.text}</span>
            <button
              style={{ backgroundColor: buttonColor }}
              className="render-container__item-button"
              onClick={() => buttonAction(task)}
            >
              {buttonText}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;