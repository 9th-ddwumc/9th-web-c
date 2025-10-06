import { validateSignin, type UserSigninInformation } from '../utils/validate';
import useForm from '../hooks/useForm';

const LoginPage = () => {
  const {values, errors, touched, getInputProps} = useForm<UserSigninInformation>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  });

  const handleSubmit = () => {
    console.log("values:", values);
  };

  const isDiabled : boolean =
    Object.values(errors || {}).some((error: string) => error.length > 0) ||
    Object.values(values).some((value: string) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex flex-col gap-3">
      <input
        {...getInputProps("email")}
        name="email"
        type="email"
        placeholder="이메일"
        className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
          errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"
        }`}
      />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}
        <input
          {...getInputProps("password")}
          type="password"
          placeholder="비밀번호"
          className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
            errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"
          }`}
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}
        <button type='button'
        onClick={handleSubmit}
        disabled={isDiabled}
        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium
        hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300">로그인</button>
      </div>
    </div>
  )
}

export default LoginPage;