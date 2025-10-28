import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const schema = z.object({
    email: z.string().email({message:"올바른 이메일 형식이 아닙니다."}),
    password: z
    .string().min(8, {message: "비밀번호는 8자 이상이어야 합니다."})
    .max(20, {message: "비밀번호는 20자 이하여야 합니다."}),
    passwordCheck:z.string().min(8, {message: "비밀번호는 8자 이상이어야 합니다."})
    .max(20, {message: "비밀번호는 20자 이하여야 합니다."}),
    name: z.string().min(1, {message:"이름을 입력해주세요."})
})
.refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path:["passwordCheck"],
});

type FormFields = z.infer<typeof schema> //타입 유추가능하게 해줌

const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1); 
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        watch, 
        trigger,
    }= useForm<FormFields>({
        defaultValues:{
            name:"",
            email:"",
            password: "",
            passwordCheck:"",
        },
        resolver:zodResolver(schema),
        mode:"onChange"
    });

    const values = watch();

     const handleNextEmail = async () => {
        const valid = await trigger("email");
        if (valid) setStep(2);
    };

    const handleNextPassword = async () => {
        const valid = await trigger(["password", "passwordCheck"]);
        if (valid) setStep(3);
    };

    const onSubmit:SubmitHandler<FormFields> = async(data)=> {
        const {passwordCheck, ...rest} = data;//passwordCheck제외 나머지
        const response = await postSignup(rest);
        console.log(response);
        navigate("/");
    };

    const isEmailValid = !errors.email && values.email;
    const isPasswordValid =
        !errors.password && !errors.passwordCheck && values.password && values.passwordCheck;
    const isNicknameValid = !errors.name && values.name;

    return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      {step === 1 && (
        <div className="flex flex-col gap-3 w-[300px]">
          <input
            {...register("email")}
            type="email"
            placeholder="이메일"
            className={`border p-[10px] rounded-sm ${
              errors.email ? "border-red-500 bg-red-200" : "border-gray-300"
            }`}
          />
          {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
          <button
            type="button"
            onClick={handleNextEmail}
            disabled={!isEmailValid}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            다음
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3 w-[300px]">
            <div className="text-gray-700 text-sm mb-2">이메일: {values.email}</div>
          <div className="relative w-full">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              className={`border p-[10px] rounded-sm w-full pr-10 ${
                errors.password ? "border-red-500 bg-red-200" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? "보이기" : "숨기기"}
            </button>
          </div>
          {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}

          <div className="relative w-full">
            <input
              {...register("passwordCheck")}
              type={showPasswordCheck ? "text" : "password"}
              placeholder="비밀번호 확인"
              className={`border p-[10px] rounded-sm w-full pr-10 ${
                errors.passwordCheck ? "border-red-500 bg-red-200" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPasswordCheck(!showPasswordCheck)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPasswordCheck ? "보이기" : "숨기기"}
            </button>
          </div>
          {errors.passwordCheck && (
            <div className="text-red-500 text-sm">{errors.passwordCheck.message}</div>
          )}

          <button
            type="button"
            onClick={handleNextPassword}
            disabled={!isPasswordValid}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            다음
          </button>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-[300px] mx-auto"> 
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-xl mx-auto">
              👤
            </div>

          <input
            {...register("name")}
            type="text"
            placeholder="닉네임"
            className={`border p-[10px] rounded-sm ${
              errors.name ? "border-red-500 bg-red-200" : "border-gray-300"
            }`}
          />
          {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}

          
          <button
            type="submit"
            disabled={!isNicknameValid || isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            회원가입 완료
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupPage;