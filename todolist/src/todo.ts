interface Todo {
    text: string;
    done: boolean;
}

const STORAGE_KEY = "todos";

function loadTodos(): Todo[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveTodos(todos: Todo[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let todos: Todo[] = loadTodos();

const input = document.querySelector(".todo-container__input") as HTMLInputElement;
const addBtn = document.querySelector(".todo-container__btn") as HTMLButtonElement;
const todoList = document.querySelector(".todo") as HTMLDivElement;
const doneList = document.querySelector(".done") as HTMLDivElement;

function renderTodos(): void {

    todoList.querySelectorAll(".todo__item").forEach(el => el.remove());
    doneList.querySelectorAll(".done__item").forEach(el => el.remove());

    todos.forEach((todo, index) => {
        const item = document.createElement("div");
        const btn = document.createElement("button");
        const span = document.createElement("span");

        span.textContent = todo.text;
        item.appendChild(span);
        item.appendChild(btn);

    if (todo.done) {
        item.className = "done__item";
        btn.className = "done__btn";
        btn.textContent = "취소";
        btn.onclick = () => {
            todos.splice(index, 1);
            saveAndRender();
        };
        doneList.appendChild(item);
    }
    else {
            item.className = "todo__item";
            btn.className = "todo__btn";
            btn.textContent = "완료";
            btn.onclick = () => {
                todos[index].done = true;
                saveAndRender();
            };
            todoList.appendChild(item);
        }
    });
}

function saveAndRender(): void {
    saveTodos(todos);
    renderTodos();
}

addBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (text) {
        todos.push({ text, done: false });
        saveAndRender();
        input.value = "";
        input.focus();
    }
});

input.addEventListener("keypress", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
        addBtn.click();
    }
});

renderTodos();
