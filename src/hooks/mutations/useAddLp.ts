import { useMutation } from "@tanstack/react-query";
import type { AddLpDto } from "../../types/lp";
import { addLp } from "../../apis/lp";
import { queryClient } from "../../App";

function useAddLp() {
  return useMutation({
    mutationFn: (lp: AddLpDto) => addLp(lp),
    onSuccess: () => {
      // LP 목록 쿼리를 무효화하여 자동으로 새로고침
      queryClient.invalidateQueries({ queryKey: ['lps'] });
    }, 
  });
};

export default useAddLp;