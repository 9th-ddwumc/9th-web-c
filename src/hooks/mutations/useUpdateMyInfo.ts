import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ResponseMyInfoDto, UpdateMyInfoDto } from "../../types/auth";
import { updateMyInfo } from "../../apis/auth";

const useUpdateMyInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMyInfoDto) => updateMyInfo(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["myInfo"] });
      const previousMyInfo = queryClient.getQueryData<ResponseMyInfoDto>([
        "myInfo",
      ]);
      if (previousMyInfo) {
        queryClient.setQueryData(["myInfo"], {
          ...previousMyInfo,
          data: {
            ...previousMyInfo.data,
            name: data.name,
            bio: data.bio ?? previousMyInfo.data.bio,
            avatar: data.avatar ?? previousMyInfo.data.avatar,
          },
        });
      }

      return { previousMyInfo };
    },
    onError: (error) => {
      alert("정보 수정 과정에서 에러가 발생했습니다. " + error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myInfo"] });
    },
  });
};

export default useUpdateMyInfo;