import {z} from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from 'react-router-dom';
import { postSignup } from "../apis/auth";

const schema = z.object({
  email: z
    .string()
    .email({ message: "올바른 이메일 형식이 아닙니다." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
  passwordCheck: z.string()
    .min(8, { message: "비밀번호는 8자 이상이어야 합니다." })
    .max(20, { message: "비밀번호는 20자 이하여야 합니다." }),
    name: z.string().min(1, { message: "이름을 입력해 주세요." })
})
.refine((data) => data.password === data.passwordCheck, {
  message: "비밀번호가 일치하지 않습니다.",
  path:["passwordCheck"],
});

type FormFields = z.infer<typeof schema>

const SignupPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;
    const response = await postSignup(rest);
    console.log(response);
  };

  return (
    <div className='flex flex-col items-center justify-center h-full gap-4 -mt-30'>
      <div className='flex items-center justify-center w-[300px] relative mb-6'>
        <button 
          type="button"
          onClick={() => navigate(-1)}
          className='absolute left-0 text-gray-600 hover:text-gray-900 transition-colors text-lg font-semibold'
        >
          &lt;
        </button>
        <span className='font-semibold text-lg'>회원가입</span>
      </div>
      <div className='flex flex-col gap-3'>
      <input
        {...register("email")}
        type="email"
        placeholder="이메일을 입력해 주세요."
        className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
          errors?.email ? 'border-red-500 bg-red-200' : 'border-gray-300'
        }`}
      />
      {errors.email && <div className='text-red-500 text-sm'>{errors.email.message}</div>}

        <input
          {...register("password")}
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
            errors?.password ? 'border-red-500 bg-red-200' : 'border-gray-300'
          }`}
        />
        {errors.password && <div className='text-red-500 text-sm'>{errors.password.message}</div>}

        <input
          {...register("passwordCheck")}
          type="password"
          placeholder="비밀번호를 다시 입력해 주세요."
          className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
            errors?.passwordCheck ? 'border-red-500 bg-red-200' : 'border-gray-300'
          }`}
        />
        {errors.passwordCheck && <div className='text-red-500 text-sm'>{errors.passwordCheck.message}</div>}

        <input
          {...register("name")}
          type="name"
          placeholder="이름을 입력해 주세요."
          className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
            errors?.name ? 'border-red-500 bg-red-200' : 'border-gray-300'
          }`}
        />
        {errors.name && <div className='text-red-500 text-sm'>{errors.name.message}</div>}

        <button
          disabled={isSubmitting}
          type="button"
          onClick={handleSubmit(onSubmit)}
          className='w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium
          hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300'
        >
          회원가입
        </button>
      </div>
    </div>
  )
}

export default SignupPage;