import { useMutation } from "@tanstack/react-query";
import { RequestPostLpDto, ResponseLpDetailDto } from "../../types/lp";
import { postLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";


const usePostLp = () => {
  return useMutation({
    mutationFn: (dto: RequestPostLpDto) => postLp(dto),
    onSuccess: (data: ResponseLpDetailDto) => {
      // LP 목록 자동 새로고침
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.lps] });
    },
    onError: (err) => {
      console.error("LP 생성 실패:", err);
      alert("LP 생성에 실패했습니다.");
    },
  });
};

export default usePostLp;