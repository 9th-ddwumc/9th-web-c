import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {email, z} from "zod";
import { postSignup } from "../apis/auth";
import { useState } from "react";
import PasswordInput from "../components/PasswordInput";
const schema = z.object({
    email: z.string().email({message: "올바른 이메일 형식이 아닙니다."}),
    password: z.string().min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
    }).max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
    }),
    passwordCheck: z.string().min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
    }).max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
    }),
    name: z.string().min(1, {message: "이름을 입력해주세요."})
    
})
.refine((data) => data.password === data.passwordCheck, {
        message: "비밀번호가 일치하지 않습니다.",
        path:['passwordCheck']
})

type FormFields = z.infer<typeof schema>

const SignupPage = () => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        watch,
    } = useForm<FormFields>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordCheck: "",
        },
        resolver: zodResolver(schema),
        mode: "onChange",
    })

    const values = watch();

    const isStep1Disabled = !!errors.email || !values.email;
    const isStep2Disabled = !!errors.password || !!errors.passwordCheck || !values.password || !values.passwordCheck;
    const isStep3Disabled = !!errors.name || !values.name;

    const onSubmit:SubmitHandler<FormFields> = async(data) => {
        const {passwordCheck, ...rest} = data;
        const response = await postSignup(rest);

        navigate("/");
    };

    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const isDisabled = Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === '');

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className='flex flex-col gap-3'>
                <div className='flex flex-row items-center justify-center'>
                    <button className='pb-5 text-2xl font-bold mr-auto
                    hover:text-[#e39db3] hover:cursor-pointer'
                    onClick={() => {
                        if (step === 1) {
                            navigate(-1); // 스텝 1이면 이전 페이지
                        } else {
                            setStep(prev => prev - 1); // 스텝 2 이상이면 이전 스텝
                        }
                    }}>{`<`}</button>
                    <h1 className='pb-5 font-bold text-2xl mr-auto'>회원가입</h1>
                </div>
                { step === 1 && (
                    <>
                        <input 
                            {...register("email")}
                            type={"email"} 
                            placeholder="이메일"
                            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                            ${errors?.email ? "border-[#ed2463] bg-[#e39db3]" : "border-gray-300"}`} 
                        />
                        {errors.email && <div className='text-red-500 text-sm'>{errors.email.message}</div>}
                        <button 
                            type='button' 
                            onClick={() => setStep(2)}
                            disabled={isStep1Disabled}
                            className ='w-full bg-[#ed2463] text-white py-3 rounded-md text-lg font-medium hover:bg-[#e31456]
                            transition-colors cursor-pointer disabled:bg-[#1f1f1f]'>다음</button>

                    </>
                    
                )}

                { step === 2 && (
                    <>
                        <div>✉️ {values.email}</div>

                        <PasswordInput
                            register={register}
                            name="password"
                            error={errors.password}
                        />

                        <PasswordInput
                            register={register}
                            name="passwordCheck"
                            error={errors.passwordCheck}
                        />

                        <button 
                            type='button' 
                            onClick={() => setStep(3)}
                            disabled={isStep2Disabled}
                            className ='w-full bg-[#ed2463] text-white py-3 rounded-md text-lg font-medium hover:bg-[#e31456]
                            transition-colors cursor-pointer disabled:bg-[#1f1f1f]'>다음</button>
                    </>
                )}


                { step === 3 && (
                    <>
                        <input 
                            {...register("name")}
                            type={"name"} 
                            placeholder="이름"
                            className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
                            ${errors?.password ? "border-[#ed2463] bg-[#e39db3]" : "border-gray-300"}`} 
                        />
                        {errors.name && <div className='text-red-500 text-sm'>{errors.name.message}</div>}


                        <button 
                            type='button' 
                            onClick={handleSubmit(onSubmit)} disabled={isSubmitting}
                            className ='w-full bg-[#ed2463] text-white py-3 rounded-md text-lg font-medium hover:bg-[#e31456]
                            transition-colors cursor-pointer disabled:bg-[#1f1f1f]'>회원가입 완료</button>
            
                    </>
                )}
                
                
            </div>
        </div>
    );
}
export default SignupPage;