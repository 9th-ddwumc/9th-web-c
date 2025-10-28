import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

//이메일, 비밀번호, 비밀번호 확인, 이름 필드의 유효성 규칙 선언.
const schema = z.object({
    email: z.string().email({message:"올바른 이메일 형식이 아닙니다."}),
    password: z
    .string().min(8, {message: "비밀번호는 8자 이상이어야 합니다."})
    .max(20, {message: "비밀번호는 20자 이하여야 합니다."}),
    passwordCheck:z.string().min(8, {message: "비밀번호는 8자 이상이어야 합니다."})
    .max(20, {message: "비밀번호는 20자 이하여야 합니다."}),
    name: z.string().min(1, {message:"이름을 입력해주세요."})
})
//.refine()로 비밀번호와 비밀번호 확인이 동일한지 추가 검증(불일치면 passwordCheck에 에러 설정).
.refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path:["passwordCheck"],
});

//폼 타입 자동화.
type FormFields = z.infer<typeof schema> //타입 유추가능하게 해줌

const SignupPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<1 | 2 | 3>(1); 
    //비밀번호 가시성 토글 상태 두 개 선언.
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    //react-hook-form의 useForm 호출 및 필요한 함수/상태 구조분해
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        watch, 
        trigger,
    }= useForm<FormFields>({
        defaultValues:{ //폼 필드 기본값 설정
            name:"",
            email:"",
            password: "",
            passwordCheck:"",
        },
        resolver:zodResolver(schema),
        mode:"onChange" //입력이 변할 때마다 validation 실행
    });

    //현재 폼 값들을 values에 구독
    const values = watch();

    
    const handleNextEmail = async () => {
        const valid = await trigger("email");
        if (valid) setStep(2);
    };

    const handleNextPassword = async () => {
        const valid = await trigger(["password", "passwordCheck"]);
        if (valid) setStep(3);
    };

    //handleSubmit이 호출하는 실제 제출 함수 — passwordCheck를 제외한 나머지 데이터로 postSignup 호출, 응답 콘솔 출력 후 홈으로 이동
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
          //이메일 인풋에 register("email")로 react-hook-form 연결.
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
        //react-hook-form이 제출 이벤트를 처리.
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