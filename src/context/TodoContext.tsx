import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Task } from "../types/Task";

export interface TodoContextType {
  input: string;
  setInput: (value: string) => void;
  todos: Task[];
  doneTasks: Task[];
  addTodo: (text: string) => void;
  completeTask: (task: Task) => void;
  deleteTask: (task: Task) => void;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [input, setInput] = useState<string>("");
  const [todos, setTodos] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    const newTask: Task = { id: Date.now(), text };
    setTodos([...todos, newTask]);
    setInput("");
  };

  const completeTask = (task: Task) => {
    setTodos(todos.filter((t) => t.id !== task.id));
    setDoneTasks([...doneTasks, task]);
  };

  const deleteTask = (task: Task) => {
    setDoneTasks(doneTasks.filter((t) => t.id !== task.id));
  };

  return (
    <TodoContext.Provider
      value={{ input, setInput, todos, doneTasks, addTodo, completeTask, deleteTask }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error("useTodo는 TodoProvider 안에서만 사용해야 합니다.");
  return context;
};