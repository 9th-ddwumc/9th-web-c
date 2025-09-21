const input = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const doneList = document.getElementById("doneList");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

function addTodo() {
  const text = input.value.trim();
  if (!text) return; 

  const li = document.createElement("li");
  li.textContent = text;

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "완료";
  completeBtn.addEventListener("click", () => moveToDone(li, text));

  li.append(completeBtn);
  todoList.append(li);

  input.value = "";
}

function moveToDone(item, text) {
  item.remove(); 

  const li = document.createElement("li");
  li.textContent = text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "삭제";
  deleteBtn.addEventListener("click", () => li.remove());

  li.append(deleteBtn);
  doneList.append(li);
}
