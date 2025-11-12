const todoInput = document.getElementById('todoInput');
const undoneList = document.getElementById('undone_list');
const doneList = document.getElementById('done_list');

// 할 일 항목을 추가했을 때 실행될 함수
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const todo = todoInput.value.trim();
        if (todo === '') return;

        // 항목 추가
        const listItem = document.createElement('li');
        
        // 항목 텍스트 담기 
        const span = document.createElement('span');
        span.textContent = todo;

        // 완료 버튼 만들기
        const doneButton = document.createElement('button');
        doneButton.textContent = '완료';
        doneButton.classList.add('done');

        //완료 버튼 클릭 시 이벤트 추가 
        doneButton.addEventListener('click', () => {
            // donelist로 항목 이동
            doneList.appendChild(listItem); 
            // 완료 버튼 제거
            doneButton.remove(); 
            
            // 삭제 버튼 만들기
            const d_Button = document.createElement('button');
            d_Button.textContent = '삭제';

            // 삭제 버튼에 이벤트 리스너 추가
            d_Button.addEventListener('click', () => {
                listItem.remove();
            });
            
            // 항목에 삭제 버튼 추가
            listItem.appendChild(d_Button);
        });
        
        // 완료버튼 추가 
        listItem.appendChild(span);
        listItem.appendChild(doneButton);
        
        
        undoneList.appendChild(listItem);

        // 입력창 비우기 
        todoInput.value = '';
    }
});