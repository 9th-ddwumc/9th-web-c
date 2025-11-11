import {useMutation } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { deleteLike } from "../../apis/lp";

function useDeleteLike() {
    return useMutation({
        mutationFn: deleteLike,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEY.lps, data.data.lpId],
                exact:true,
            });
        },
    });
}

export default useDeleteLike;