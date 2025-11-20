import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { RequestSigninDto } from "../../types/auth";
import { useMutation } from "@tanstack/react-query";
import { CommonResponse } from "../../types/common";
import { postLogout, postUnsubscribe } from "../../apis/auth";

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  return useMutation<void, Error, RequestSigninDto>({
    mutationFn: async (data) => {
      await login(data);
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useMutation<CommonResponse<null>, Error, void>({
    mutationFn: postLogout,
    onSuccess: async () => {
      await logout();
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUnsubscribe = () => {
    const navigate = useNavigate();
    const {unsubscribe} = useAuth();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
        await postUnsubscribe(); // 서버에 탈퇴 요청
        await unsubscribe();     // context에서 상태 초기화

      
    },
    onSuccess: () => {
      navigate("/login");           // 홈으로 리다이렉트
      alert("회원 탈퇴가 완료되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    },
  });
};