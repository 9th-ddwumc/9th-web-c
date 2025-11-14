import { useMutation } from "@tanstack/react-query";
import { patchLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { RequestPostLpDto } from "../../types/lp";
import { QUERY_KEY } from "../../constants/key";

interface PatchLpVariables {
  lpId: number;
  lpData: RequestPostLpDto;
}

const usePatchLp = () => {
  return useMutation({
    mutationFn: ({ lpId, lpData }: PatchLpVariables) => patchLp({ lpId }, lpData),
    onSuccess: (_, variables) => {
      // LP 리스트 전체 갱신
      queryClient.invalidateQueries({queryKey:[QUERY_KEY.lps]});
      // 개별 LP도 갱신
      queryClient.invalidateQueries({queryKey:[QUERY_KEY.lp, variables.lpId]});
    },
    onError: (err) => {
      console.error("LP 수정 실패:", err);
    },
  });
};

export default usePatchLp;
