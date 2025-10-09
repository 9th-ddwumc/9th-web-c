import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { postSignin } from "../apis/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STRAGE_KEY } from "../constants/key";

const LoginPage = () => {
    const {setItem} = useLocalStorage(LOCAL_STRAGE_KEY.accessToken)
    const navigate = useNavigate();

    const {values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValue: {
            email:"",
            password:"",
        },
        validate: validateSignin,
    });

    const handleSubmit = async() => {
        console.log(values);
        try{
            const response = await postSignin(values);
            setItem(response.data.accessToken);
        }catch(error){
            alert("예기치 못한 오류가 발생했습니다.");
        }
    };


    const handleGoHome = () => {
        navigate("/"); 
    };
    const isDisabled = 
        Object.values(errors || {}).some((error) => error.length > 0)|| //오류가 있으면 true
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
                type={`passward`}
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