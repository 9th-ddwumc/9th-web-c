const todoInput = document.getElementById('todoInput');
const undoneList = document.getElementById('undone_list');
const doneList = document.getElementById('done_list');

// 할 일 항목을 추가했을 때 실행될 함수
todoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const todo = todoInput.value.trim();
        if (todo === '') return;

        // 1. 항목 추가
        const listItem = document.createElement('li');
        
        // 2. 항목 텍스트 담기 
        const span = document.createElement('span');
        span.textContent = todo;

        // 3. 완료 버튼 만들기
        const doneButton = document.createElement('button');
        doneButton.textContent = '완료';
        doneButton.classList.add('done');

        // 4. '완료' 버튼 이벤트(donelist이동, 삭제 버튼 추가 )
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
        
        // 5. 항목에 텍스트와 완료 버튼 추가 (삭제 버튼은 나중에 추가)
        listItem.appendChild(span);
        listItem.appendChild(doneButton);
        
        // 6. 완성된 항목을 To-Do 목록에 추가합니다.
        undoneList.appendChild(listItem);

        // 7. 입력창을 비웁니다.
        todoInput.value = '';
    }
});