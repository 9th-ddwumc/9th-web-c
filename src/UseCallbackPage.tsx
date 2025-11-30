import { useState, useCallback } from "react";
import CountButton from "./components/CountButton";
import TextInput from "./components/TextInput";

export default function UseCallbackPage() {
    const [count, setCount] = useState<number>(0);
    const [text, setText] = useState<string>('');

    const handleIncreaseCount = useCallback((number: number): void => {
        setCount(count + number);
    }, [count]);

    const handleText = useCallback((text: string): void => {
        setText(text);
    }, []);

    return (
        <div>
            <h1>같이 배우는 리액트 useCallback편</h1>
            <h2>Count: {count}</h2>
            <CountButton onClick={handleIncreaseCount} />
            <h2>Text</h2>
            <div className='flex flex-col'>
                <span>{text}</span>
                <TextInput onChange={handleText} />
            </div>
        </div>
    )
}