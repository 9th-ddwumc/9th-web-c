import { useEffect, useState, type ChangeEvent } from "react";

interface useFormProps<T> {
  initialValues: T;
  // 값이 올바른지 검증하는 함수
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValues, validate }: useFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  // 사용자가 입력값을 바꿀 때 실행되는 함수
  const handleChange = (name: keyof T, text: string) => {
    setValues((prevValues) => ({
      ...prevValues, // 불변성 유지
      [name]: text,
    }));
  };

  // 입력창이 포커스에서 벗어날 때 실행
  const handleBlur = (name: keyof T) => {
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name as string]: true,
    }));
  };

  // input, textarea에서 바로 props로 연결할 수 있는 함수
  const getInputProps = (name: keyof T) => ({
    value: values[name],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value),
    onBlur: () => handleBlur(name),
  });

  // 값이 바뀔 때마다 검증
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;
