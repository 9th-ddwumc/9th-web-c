import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postLogout } from "../../apis/auth";
import { useAuth } from "../../context/AuthContext";
import type { CommonResponse } from "../../types/common";

const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return useMutation<CommonResponse<null>, Error, void>({
    mutationFn: postLogout,
    onSuccess: async () => {
      await logout();
      alert("로그아웃되었습니다.");
      navigate("/");
    },
    onError: (error) => {
      console.log("로그아웃 실패: ", error);
      alert("로그아웃에 실패했습니다.");
    },
  });
};

export default useLogout;