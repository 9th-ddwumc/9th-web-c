import { useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { Likes, ResponseLpDetailDto } from "../../types/lp";
import { ResponseMyInfoDto } from "../../types/auth";

interface PostLikePayload {
  lpId: number;
}

function usePostLike() {
  return useMutation({
    mutationFn: postLike,

    // API 요청 전에 UI 즉시 업데이트
    onMutate: async ({ lpId }: PostLikePayload) => {
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

      // 이미 좋아요 눌렀는지 확인
      const likedIndex = newLpPost.data.data.likes.findIndex((like) => like.userId === userId);
      if (likedIndex === -1) {
        // 임시 id: 서버가 실제로 지정해줄 id 없으니 -1로
        const newLike: Likes = { id: -1, userId, lpId };
        (newLpPost.data.data.likes as Likes[]).push(newLike);
      }

      queryClient.setQueryData([QUERY_KEY.lps, lpId], newLpPost);
      return { previosLpPost };
    },

    // 에러 발생 시 원래 캐시 복구
    onError: (_err, variables, context) => {
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

export default usePostLike;
