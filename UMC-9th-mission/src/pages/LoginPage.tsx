import { useState } from "react";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
        initialValues: {
            email: "",
            password: "",
        },
        validate: validateSignin,
    })



    const handleSubmimt = () => {
        console.log(values);
    }

    //오류가 하나라도 있거나 입력값 비어있으면 활성화
    const isDisabled = Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === '');

    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className='flex flex-col gap-3'>
                <div className='flex flex-row items-center justify-center'>
                    <button className='pb-5 text-2xl font-bold mr-auto
                    hover:text-[#e39db3] hover:cursor-pointer'
                    onClick={() => navigate(-1)}>{`<`}</button>
                    <h1 className='pb-5 font-bold text-2xl mr-auto'>로그인</h1>
                </div>
                
                <input 
                    {...getInputProps("email")}
                    type={"email"} 
                    placeholder="이메일"
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                ${errors?.email && touched?.email ? "border-[#ed2463] bg-[#e39db3]" : "border-gray-300"}`} />
                {errors?.email && touched?.email && (<div className="text-[#ed2463] text-sm">{errors.email}</div>)}
                <input 
                    {...getInputProps("password")}
                    type={"password"} 
                    placeholder="비밀번호"
                className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                ${errors?.password && touched?.password ? "border-[#ed2463] bg-[#e39db3]" : "border-gray-300"}`} />
                {errors?.password && touched?.password && (<div className="text-[#ed2463] text-sm">{errors.password}</div>)}
                <button type='button' onClick={handleSubmimt} disabled={isDisabled}
                className ='w-full bg-[#ed2463] text-white py-3 rounded-md text-lg font-medium hover:bg-[#e31456]
                transition-colors cursor-pointer disabled:bg-[#1f1f1f]'>로그인</button>
            </div>
        </div>
    
    );
}
export default LoginPage;
