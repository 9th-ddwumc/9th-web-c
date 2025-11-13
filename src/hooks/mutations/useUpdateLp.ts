import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateLpDto } from "../../types/lp";
import { updateLp } from "../../apis/lp";

export const useUpdateLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lp: UpdateLpDto) => updateLp(lp),
    onSuccess: (_, variables) => {
      // 특정 LP 상세 정보 갱신
      queryClient.invalidateQueries({ 
        queryKey: ["lpDetail", variables.lpId] 
      });
      // LP 목록도 갱신 (제목이나 썸네일이 바뀔 수 있으므로)
      queryClient.invalidateQueries({ 
        queryKey: ["lps"] 
      });
    },
  });
};