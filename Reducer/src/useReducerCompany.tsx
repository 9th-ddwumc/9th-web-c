import { useReducer, useState } from "react";

interface IState {
    department: string;
    error: string | null;
}

interface IAction {
    type: 'CHANGE_DEPARTMENT' | 'RESET';
    payload?: string;
}

function reducer(state: IState, action: IAction){
    const { type, payload } = action;

    switch (type) {
        case 'CHANGE_DEPARTMENT':
            const newDepartment = payload;
            const hasError = newDepartment !== '카드메이커';
            return {
                ...state,
                department: hasError ? state.department : newDepartment,
                error: hasError ? '거부권 행사 가능, 카드메이커만 입력 가능' : null,
            }
        case 'RESET':
            return {
                ...state,
                department: 'Software Developer',
                error: null,
            }
        default:
            return state;
    }
}

export default function UseReducerCompany() {
    const [state, dispatch] = useReducer(reducer, {
        department: 'Software Developer',
        error: null,
    });

    const [department, setDepartment] = useState('');

    const changeDepartment = () => {
        if (department !== '카드메이커'){
            setError('거부권 행사 가능');
        } else {
            setDepartment(department);
            setError(null);
        }
    }
    const handleChangeDepartment = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDepartment(e.target.value);
    }

    return (
        <div>
            <h1>{state.department}</h1>
            {state.error && <p className="text-red-500 font-2xl">{state.error}</p>}

            <input className='w-[400px] h-10 rounded-md px-2 text-white border-2 mt-4'
            placeholder="변경하고 싶은 직무를 입력하세요."
            value={department} onChange={handleChangeDepartment} />
            <button className="ml-4 px-4 py-2 bg-blue-400 text-white font-bold rounded hover:bg-blue-200"
            onClick={() => dispatch({ type: 'CHANGE_DEPARTMENT', payload: department })}>
                직무 변경
            </button>
            <button className="ml-4 px-4 py-2 bg-gray-400 text-white font-bold rounded hover:bg-gray-200"
            onClick={() => dispatch({ type: 'RESET' })}>
                초기화
            </button>
        </div>
        
    );
}