import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { deleteLp } from "../../apis/lp";

const useDeleteLp = () => {
    return useMutation({
    mutationFn: deleteLp,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:[QUERY_KEY.lps]});
    },
    onError: (err) => {
        console.error("LP 삭제 실패");
    },
  });
}

export default useDeleteLp;