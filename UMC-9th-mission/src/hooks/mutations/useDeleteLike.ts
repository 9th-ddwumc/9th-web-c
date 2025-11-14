import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { Likes, ResponseLpDetailDto } from "../../types/lp";
import { ResponseMyInfoDto } from "../../types/auth";

interface DeleteLikePayload {
  lpId: number;
}

function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,

    // API 요청 전에 UI 즉시 업데이트
    onMutate: async ({ lpId }: DeleteLikePayload) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lpId],
      });

      const previosLpPost = queryClient.getQueryData<ResponseLpDetailDto>([QUERY_KEY.lps, lpId]);
      const me = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);
      const userId = Number(me?.data.id);

      if (!previosLpPost || !userId) return { previosLpPost };

      // 깊은 복사
      const newLpPost: ResponseLpDetailDto = {
        ...previosLpPost,
        data: {
          ...previosLpPost.data,
          data: {
            ...previosLpPost.data.data,
            likes: [...previosLpPost.data.data.likes],
          },
        },
      };

      const likedIndex = newLpPost.data.data.likes.findIndex((like) => like.userId === userId);

      // 좋아요 취소
      if (likedIndex >= 0) {
        newLpPost.data.data.likes.splice(likedIndex, 1);
      }

      queryClient.setQueryData([QUERY_KEY.lps, lpId], newLpPost);
      return { previosLpPost };
    },

    // 에러 발생 시 원래 캐시 복구
    onError: (err, variables, context) => {
      if (context?.previosLpPost) {
        queryClient.setQueryData([QUERY_KEY.lps, variables.lpId], context.previosLpPost);
      }
    },

    // 성공/실패 후 항상 최신 데이터 조회
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, variables.lpId],
      });
    },
  });
}

export default useDeleteLike;
