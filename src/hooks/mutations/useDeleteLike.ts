import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpDto } from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    onMutate: async (lp) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lp.lpId],
      });

      const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
        QUERY_KEY.lps,
        lp.lpId,
      ]);

      if (!previousLpPost) return { previousLpPost: null };

      const me = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);

      const userId = Number(me?.data.id);

      const newLpPost = {
        ...previousLpPost,
        data: {
          ...previousLpPost.data,
          likes: previousLpPost.data.likes.filter(
            (like) => like.userId !== userId
          ),
        },
      };

      queryClient.setQueryData([QUERY_KEY.lps, lp.lpId], newLpPost);

      return { previousLpPost };
    },

    onError: (err, newLp, context) => {
      console.log(err, newLp);
      if (context?.previousLpPost) {
        queryClient.setQueryData(
          [QUERY_KEY.lps, newLp.lpId],
          context.previousLpPost
        );
      }
    },

    onSettled: async (data, error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, variables.lpId],
      });
    },
  });
}

export default useDeleteLike;