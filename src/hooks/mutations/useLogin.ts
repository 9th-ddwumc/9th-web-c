import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import type { RequestSigninDto } from "../../types/auth";

const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || "/";

  return useMutation<void, Error, RequestSigninDto>({
    mutationFn: async (data) => {
      await login(data);
    },
    onSuccess: () => {
      console.log(`로그인 성공! ${from}으로 이동합니다.`);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    },
  });
};

export default useLogin;