import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResponseMyInfoDto, UpdateMyInfoDto } from "../../types/auth";
import { updateMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

const useUpdateMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMyInfoDto) => updateMyInfo(data),

    // 낙관적 업데이트 (서버 응답 전 UI 즉시 반영)
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      // 기존 데이터 백업
      const previousMyInfo =
        queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);

      // 캐시 즉시 업데이트 → NavBar + MyPage 모두 즉시 반영됨
      if (previousMyInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], {
          ...previousMyInfo,
          data: {
            ...previousMyInfo.data,
            name: newData.name,
            bio: newData.bio ?? previousMyInfo.data.bio,
            avatar: newData.avatar ?? previousMyInfo.data.avatar,
          },
        });
      }

      // 롤백용 데이터 반환
      return { previousMyInfo };
    },

    // 에러 발생 시 롤백
    onError: (error, _, context) => {
      if (context?.previousMyInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousMyInfo);
      }
      alert("정보 수정 과정에서 에러가 발생했습니다. " + error);
    },

    // 성공·실패와 관계없이 서버 최신 데이터로 갱신
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.myInfo] });
    },
  });
};

export default useUpdateMyInfo;
