import { useCallback, useState } from "react";
import CountButton from "./components/CountButton";
import TextInput from "./components/TextInput";

export default function UseCallbackPage() {
    const [count, setCount] = useState<number>(0);
    //참조(heavyComputation),콜백(()=>heavyComputation()) 아닌 함수heavyComputation()으로 쓰면 클릭마다 heavyComputation작업을 계속하게됨
    const [text, setText] = useState<string>("");
    
    const handleIncreaseCount = useCallback((number: number) => {
        setCount(count + number);
    /*빈 배열 = 이 함수가 처음 한번만 만들어져야 한다.
    *함수 내부에서 count값은 초기값인 0으로 기억하고 있다.
    *두번째 클릭을 해도, 0 +10 이 되어서 count값이 변하지 않는다.
    *첫번째 클릭도 0 + 10
    *두번째 클릭도 0 + 10
    */
    },[count]);

    const handleText = useCallback((text: string) => {
        setText(text);
    },[]);

    return <div>
        <h1>같이 배우는 리엑트 useCallback편</h1>
        <h2>Count : {count}</h2>
            <CountButton onClick={handleIncreaseCount}/>
        <h2>Text</h2>
        <div className="flex flex-col">
            <span>{text}</span>
            <TextInput onChange={handleText}/>
        </div>
    </div>;
};
/**주의할 점
 * 1.디펜던시 배열(의존성 배열)을 신중하게 설정
 * -만약 count를 넣지 않으면 최신 값이 반영되지 않을 수 있다.
 * -너무 많은 변수를 넣은 경우, 최적화 효과가 사라질 수 있다.
 * 
 * 2.useCallback TradeOff
 * -useCallback 함수가 메모리에 저장되기 때문에, 메모리를 많이 사용함
 * -정말 필요할 때 사용하기
 */