import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpDto } from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";

function usePostLike() {
  return useMutation({
    mutationFn: postLike,
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

      const isAlreadyLiked = previousLpPost.data.likes.some(
        (like) => like.userId === userId
      );

      const newLpPost = {
        ...previousLpPost,
        data: {
          ...previousLpPost.data,
          likes: isAlreadyLiked
            ? previousLpPost.data.likes
            : [...previousLpPost.data.likes, { userId, lpId: lp.lpId }],
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

export default usePostLike;