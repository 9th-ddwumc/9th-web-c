import { useLocation, useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import type { RequestSigninDto } from "../types/auth";
import { postSignin } from "../apis/auth";

// 로그인 페이지 컴포넌트
const LoginPage = () => {
    //const {login, accessToken} = useAuth();
    const { accessToken, login} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
     // location.state (navigate의 state)에서 읽어옴 
     //만약 from값이 없으면 my로설정
    const from = location.state?.from || "/my"
    

    useEffect(() => {
        if (accessToken) {
       navigate(from, { replace: true }); // 사용자를 '원래 가려던 페이지(from)'로 즉시 리다이렉트
        }
    }, [navigate, accessToken, from]);
    
   // 로그인 useMutation 구현
  const loginMutation = useMutation({
    mutationFn: (loginData: RequestSigninDto) => postSignin(loginData),
    onSuccess: (response) => {
      // 성공 시
      const { data } = response;
      if (data) {
        // AuthContext의 login 함수를 호출해 토큰을 저장
        login(data.accessToken, data.refreshToken);
        
        // 'myInfo' 쿼리는 Navbar가 accessToken 변경을 감지하고 자동으로 refetch함
        
        // 홈(or 'from') 화면으로 리다이렉션
        navigate(from, { replace: true });
        alert("로그인 성공"); // (AuthContext에서 여기로 이동)
      }
    },
    onError: (error) => {
      console.error("로그인 오류", error);
      alert("로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.");
    },
  });

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
        // 로그인 로직 (구글 로그인 버튼 클릭 시 실행)
        // await login(values); // 실제 구현된 로그인 함수 호출
        loginMutation.mutate(values);
    };

    //홈으로 이동하는 함수
    const handleGoHome = () => {
        navigate("/"); 
    };

    // 구글 로그인
    const handleGoogleLogin = () => {
    const redirectUrl =
        import.meta.env.VITE_SERVER_API_URL +
        `/v1/auth/google/login?from=${encodeURIComponent(from)}`;

    window.location.href = redirectUrl;
    };
    //버튼 비활성화 조건
    const isDisabled = 
    /*
        //errors 객체의 값 중 하나라도 길이가 있으면(에러 존재) true
        Object.values(errors || {}).some((error) => error.length > 0)|| //오류가 있으면 true
        //values 중 하나라도 빈 문자열이면(미입력) true
        Object.values(values).some((value) => value === ""); //입력값이 비어있으면 true
    */
        loginMutation.isPending ||
            Object.values(errors || {}).some((error) => error.length > 0) || //오류가 있으면 true
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
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                    {/*  로딩 상태 표시 */}
                    {loginMutation.isPending ? "로그인 중..." : "로그인"}
            </button>
             <button 
                type="button" 
                onClick={handleGoogleLogin} 
                //disabled={isDisabled} 
                className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300"
                >
                    <div className="flex items-center justify-center gap-4">
                        <img src = {"/Google_Favicon_2025.svg"} alt="Google Logo Image" className="w-10 h-10"/>
                        <span>구글 로그인</span>
                    </div>
            </button>
        </div>
    </div>
    )
}

export default LoginPage;