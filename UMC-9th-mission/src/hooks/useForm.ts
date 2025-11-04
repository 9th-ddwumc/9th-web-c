import { useEffect, useState, type ChangeEvent } from "react";

//useForm 훅이 받을 인자(props)의 타입 정의.
interface useFormProps<T>{
    initialValue:T; //{email: '', password:''}이렇게 넘겨받음
    validate:(values: T) => Record<keyof T, string>; //값이 올바른지 검증하는 함수
}

function useForm<T>({initialValue, validate}: useFormProps<T>){
    const [values, setValues] = useState(initialValue)
    //사용자가 해당 input을 한 번이라도 건드렸는지 여부 저장.
    const [touched, setTouched] =useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
    const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);

    //사용자가 입력값을 바꿀 때 실행되는 함수
    const handleChange = (name:keyof T, text:string) => {
        setValues({
            ...values,//불변성 유지(기존 값 유지)
            [name]:text,
        })
    }

    //사용자가 인풋을 클릭했다가 나갈 때(onBlur 이벤트), 해당 필드가 touched 상태로 표시
    const handleBlur = (name: keyof T) => {
       setTouched({
        ...touched,
        [name]:true,
       })

    }

    //이메일 인풋, 패스워드 인풋, 속성들을 가져오는 것
    const getInputProps = (name: keyof T) => {
        const value : T[keyof T] = values[name];
        
        const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            handleChange(name, e.target.value);

        const onBlur = () => handleBlur(name);

        return {value, onChange, onBlur};
    };

    //vlaues가 변경될 때 마다 에러 검증 로직이 실행됨
    useEffect(() => {
        const newErrors: Record<keyof T, string> = validate(values);
        setErrors(newErrors);//오류 메시지 업뎃
    },[validate, values]);

    return {values, errors, touched, getInputProps};
}

export default useForm;