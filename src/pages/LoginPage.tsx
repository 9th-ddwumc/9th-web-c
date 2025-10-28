import { validateSignin, type UserSigninInformation } from '../utils/validate';
import useForm from '../hooks/useForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValue: {
      email: "",
      password: "",
    },
    validate: validateSignin,
  });

const handleSubmit = async () => {
  await login(values);
  navigate("/mypage");
};

  const isDiabled : boolean =
    Object.values(errors || {}).some((error: string) => error.length > 0) ||
    Object.values(values).some((value: string) => value === "");

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 -mt-30">
      <div className="flex items-center justify-center w-[300px] relative mb-6">
        <button 
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-0 hover:text-gray-300 transition-colors text-lg text-white font-semibold"
        >
          &lt;
        </button>
        <span className='font-semibold text-lg text-white'>로그인</span>
      </div>
      <div className="flex flex-col gap-3">
      <input
        {...getInputProps("email")}
        name="email"
        type="email"
        placeholder="이메일을 입력해 주세요."
        className={`text-white placeholder-white border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] ${
          errors?.email && touched?.email ? "border-red-500 bg-red-200" : "border-gray-300"
        }`}
      />
        {errors?.email && touched?.email && (
          <div className="text-red-500 text-sm">{errors.email}</div>
        )}
        <input
          {...getInputProps("password")}
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          className={`border w-[300px] p-[10px] rounded-sm focus:border-[#807bff] text-white placeholder-white ${
            errors?.password && touched?.password ? "border-red-500 bg-red-200" : "border-gray-300"
          }`}
        />
        {errors?.password && touched?.password && (
          <div className="text-red-500 text-sm">{errors.password}</div>
        )}
        <button type='button'
        onClick={handleSubmit}
        disabled={isDiabled}
        className="w-full bg-pink-600 text-white py-3 rounded-md text-lg font-medium
        hover:bg-pink-700 transition-colors cursor-pointer disabled:bg-gray-300">로그인</button>
      </div>
    </div>
  )
}

export default LoginPage;