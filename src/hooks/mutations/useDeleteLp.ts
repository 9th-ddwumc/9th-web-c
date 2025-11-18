import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DeleteLpDto } from "../../types/lp";
import { deleteLp } from "../../apis/lp";

export const useDeleteLp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lp: DeleteLpDto) => deleteLp(lp),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ["lps"] 
      });
    },
  });
};