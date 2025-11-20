import { validateSignin, type UserSigninInformation } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLogin } from "../hooks/mutations/useAuthMutation";

interface LocationState {
  from?: { pathname: string };
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAuth();
  const state = location.state as LocationState | undefined;
  const from = state?.from?.pathname || "/";

  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValues: { email: "", password: "" },
    validate: validateSignin,
  });

  const {mutate:login} = useLogin();

  // 이미 로그인되어 있으면 리다이렉트
  if (accessToken) {
    navigate(from, { replace: true });
  }

  const handleSubmit = () => {
    login(values);
  };

  const handleGoogleLogin = () => {
    const redirectTo = encodeURIComponent(from);
    window.location.href = `http://localhost:8000/v1/auth/google/login?redirect=${redirectTo}`;
  };

  const isDisabled =
    Object.values(errors).some((e) => e.length > 0) ||
    Object.values(values).some((v) => v === "");

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-center justify-center">
          <button
            className="pb-5 text-2xl font-bold mr-auto hover:text-[#e39db3] hover:cursor-pointer"
            onClick={() => navigate(-1)}
          >{`<`}</button>
          <h1 className="pb-5 font-bold text-2xl mr-auto">로그인</h1>
        </div>

        <input
          {...getInputProps("email")}
          type="email"
          placeholder="이메일"
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.email && touched?.email ? "border-[#ed2463] bg-[#e39db3]" : "border-gray-300"}`}
        />
        {errors?.email && touched?.email && <div className="text-[#ed2463] text-sm">{errors.email}</div>}

        <input
          {...getInputProps("password")}
          type="password"
          placeholder="비밀번호"
          className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.password && touched?.password ? "border-[#ed2463] bg-[#e39db3]" : "border-gray-300"}`}
        />
        {errors?.password && touched?.password && <div className="text-[#ed2463] text-sm">{errors.password}</div>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full bg-[#ed2463] text-white py-3 rounded-md text-lg font-medium hover:bg-[#e31456] transition-colors cursor-pointer disabled:bg-[#1f1f1f]"
        >
          로그인
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-[#ed2463] text-white py-3 rounded-md text-lg font-medium hover:bg-[#e31456] transition-colors cursor-pointer disabled:bg-[#1f1f1f]"
        >
          <div className="flex items-center justify-center gap-4">
            <img className="w-8 h-8" src={"/google.png"} alt="Google Logo Image" />
            <span>구글 로그인</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
