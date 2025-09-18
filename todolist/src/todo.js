var STORAGE_KEY = "todos";
function loadTodos() {
    var data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}
function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
var todos = loadTodos();
var input = document.querySelector(".todo-container__input");
var addBtn = document.querySelector(".todo-container__btn");
var todoList = document.querySelector(".todo");
var doneList = document.querySelector(".done");
function renderTodos() {
    todoList.querySelectorAll(".todo__item").forEach(function (el) { return el.remove(); });
    doneList.querySelectorAll(".done__item").forEach(function (el) { return el.remove(); });
    todos.forEach(function (todo, index) {
        var item = document.createElement("div");
        var btn = document.createElement("button");
        var span = document.createElement("span");
        span.textContent = todo.text;
        item.appendChild(span);
        item.appendChild(btn);
        if (todo.done) {
            item.className = "done__item";
            btn.className = "done__btn";
            btn.textContent = "취소";
            btn.onclick = function () {
                todos.splice(index, 1);
                saveAndRender();
            };
            doneList.appendChild(item);
        }
        else {
            item.className = "todo__item";
            btn.className = "todo__btn";
            btn.textContent = "완료";
            btn.onclick = function () {
                todos[index].done = true;
                saveAndRender();
            };
            todoList.appendChild(item);
        }
    });
}
function saveAndRender() {
    saveTodos(todos);
    renderTodos();
}
addBtn.addEventListener("click", function () {
    var text = input.value.trim();
    if (text) {
        todos.push({ text: text, done: false });
        saveAndRender();
        input.value = "";
        input.focus();
    }
});
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addBtn.click();
    }
});
renderTodos();
