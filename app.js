// 요소 선택
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');

// 할 일 추가 함수
function addTodo(text) {
    const li = document.createElement('li');
    li.textContent = text;

    // 완료 버튼
    const doneBtn = document.createElement('button');
    doneBtn.textContent = '완료';
    doneBtn.style.marginLeft = '10px';
    doneBtn.onclick = () => {
        doneList.appendChild(li);
        li.removeChild(doneBtn);
        li.appendChild(deleteBtn);
    };

    // 삭제 버튼
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '삭제';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.onclick = () => li.remove();

    li.appendChild(doneBtn);
    todoList.appendChild(li);
}

// Enter 입력 처리
todoInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && todoInput.value.trim() !== '') {
        addTodo(todoInput.value.trim());
        todoInput.value = '';
    }
});
