import { useMutation } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/auth";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { ResponseMyInfoDto } from "../../types/auth";

interface PatchMyInfoPayload {
  name: string;
  bio: string;
  avatar: string;
}

const usePatchMyInfo = () => {
  return useMutation<ResponseMyInfoDto, Error, PatchMyInfoPayload, { previousData?: ResponseMyInfoDto }>({
    mutationFn: patchMyInfo,

    // 서버 요청 전에 캐시를 먼저 업데이트
    onMutate: async (newData) => {
      // 1. 현재 캐시 데이터를 가져옴
      await queryClient.cancelQueries({queryKey:[QUERY_KEY.myInfo]});
      const previousData = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);

      // 2. Nav-Bar와 마이페이지에서 즉시 반영
      queryClient.setQueryData([QUERY_KEY.myInfo], (oldData: ResponseMyInfoDto | undefined) => ({
        ...oldData,
        data: {
          ...oldData?.data,
          name: newData.name,
          bio: newData.bio,
          avatar: newData.avatar,
        },
      }));

      return { previousData };
    },

    // 요청 실패 시 롤백
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousData);
      }
      alert("닉네임 변경 실패");
    },

    // 요청 성공 후 캐시 최신화
    onSettled: () => {
      queryClient.invalidateQueries({queryKey:[QUERY_KEY.myInfo]});
    },
  });
};

export default usePatchMyInfo;
