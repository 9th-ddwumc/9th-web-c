import {useState} from 'react';
import type { FormEvent } from 'react';
import type {TTodo} from '../types/todo';

const TodoBefore=() => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);
    const [input, setinput] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = input.trim();

        if(text){
            const newTodo : TTodo = {id:Date.now(), text};
            setTodos((prevTodos) =>[...prevTodos, newTodo]);
            setinput('');
        }
    };

    const CompleteTodo = (todo :TTodo) => {
        setTodos((prevTodos) => prevTodos.filter(t => t.id !== todo.id))
        setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
    };

    const deleteTodo = (todo :TTodo) => {
        setDoneTodos((prevDoneTodo) => prevDoneTodo.filter((t)=> t.id !== todo.id));
    }
    return(
        <div className="todo-container">
            <h1 className="todo-container__header">YONG TODO</h1>
            <form onSubmit={handleSubmit} className="todo-container__form">
                <input value={input} onChange={(e) =>setinput(e.target.value)} type="text" className="todo-container__input" placeholder="할 일 입력" required></input>
                <button type="submit" className="todo-container__button">할 일 추가</button>
            </form>
            <div className="render-container">
                <div className="render-container-__section">
                    <h2 className="render-container__title">할 일</h2>
                    <ul id='todo-List' className="render-container__list">
                        {todos.map(todo  => 
                            <li className="render-container__item">
                            <span className='render-container__item-text'>{todo.text}</span>
                            <button 
                            onClick = {() => CompleteTodo(todo)}
                            style={{
                                backgroundColor: '#28a745',
                            }} 
                            className="render-container__item-button">완료</button>
                        </li>
                        )}
                    </ul>
                </div>
                <div className="render-container-__section">
                    <h2 className="render-container__title">완 료</h2>
                    <ul id='todo-List' className="render-container__list">
                        {doneTodos.map(todo => 
                            <li className="render-container__item">
                            <span className='render-container__item-text'>{todo.text}</span>
                            <button 
                            onClick={() => deleteTodo(todo)}
                            style={{
                                backgroundColor: '#dc3545',
                            }} 
                            className="render-container__item-button">삭제</button>
                        </li>
                        )}
                        
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TodoBefore;
