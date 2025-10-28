import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const LoginPage = () => {
    const {login, accessToken} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(accessToken){
            navigate("/");
        }
    },[navigate, accessToken]);
    
    //제네릭으로 UserSigninInformation 타입을 지정하고 반환값을 구조분해.
    const {values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValue: {
            email:"",
            password:"",
        },
        validate: validateSignin,
    });

    //로그인 버튼 클릭 시 호출
    const handleSubmit = async() => {
        await login(values);
    };

    //홈으로 이동하는 함수
    const handleGoHome = () => {
        navigate("/"); 
    };

    //버튼 비활성화 조건
    const isDisabled = 
        //errors 객체의 값 중 하나라도 길이가 있으면(에러 존재) true
        Object.values(errors || {}).some((error) => error.length > 0)|| //오류가 있으면 true
        //values 중 하나라도 빈 문자열이면(미입력) true
        Object.values(values).some((value) => value === ""); //입력값이 비어있으면 true
    
    return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 mb-4">
                <button 
                    className="px-6 py-3 hover:bg-[#b2dab1] transition-all duration-200 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed" 
                    onClick={handleGoHome}>
                        {`<`}
                </button>
                <span className="text-lg font-semibold">로그인</span>
            </div>
            <input 
                //getInputProps("email")를 스프레드하여 value, onChange, onBlur 연결.
                {...getInputProps("email")}
                name="email"
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                    ${errors?.email &&touched?.email ? "border-red-500 bg-red-200": "border-gray-300"}`}
                type={`email`}
                placeholder={"이메일"}
            />
            {errors?.email && touched?.email &&(
                <div className="text-red-500 text-sm">{errors.email}</div>
            )}
            <input 
                {...getInputProps("password")}
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm 
                    ${errors?.password &&touched?.password ? "border-red-500 bg-red-200": "border-gray-300"}`}
                type={`password`}
                placeholder={"비밀번호"}
            />
             {errors?.password && touched?.password &&(
                <div className="text-red-500 text-sm">{errors.password}</div>
            )}
            <button 
                type="button" 
                onClick={handleSubmit} 
                disabled={isDisabled} 
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300">
                    로그인
            </button>
        </div>
    </div>
    )
}

export default LoginPage;