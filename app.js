const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const dones = JSON.parse(localStorage.getItem('dones')) || [];
    
    todos.forEach(todo => addTodo(todo, false));
    dones.forEach(done => addTodo(done, true));
}

function saveTodos() {
    const todos = Array.from(todoList.children).map(li => li.firstChild.textContent);
    const dones = Array.from(doneList.children).map(li => li.firstChild.textContent);
    
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('dones', JSON.stringify(dones));
}

function addTodo(text, isDone = false) {
    const li = document.createElement('li');
    li.textContent = text;

    const doneBtn = document.createElement('button');
    doneBtn.textContent = '완료';
    doneBtn.style.marginLeft = '10px';
    doneBtn.onclick = () => {
        doneList.appendChild(li);
        li.removeChild(doneBtn);
        li.appendChild(deleteBtn);
        saveTodos();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.onclick = () => {
        li.remove();
        saveTodos();
    };

    if (isDone) {
        li.appendChild(deleteBtn);
        doneList.appendChild(li);
    } else {
        li.appendChild(doneBtn);
        todoList.appendChild(li);
    }
    
    if (!isDone) saveTodos();
}

todoInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && todoInput.value.trim() !== '') {
        addTodo(todoInput.value.trim());
        todoInput.value = '';
    }
});

document.addEventListener('DOMContentLoaded', loadTodos);