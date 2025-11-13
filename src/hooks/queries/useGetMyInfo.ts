import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getMyInfo } from "../../apis/auth";

function useGetMyInfo(accessToken: string | null) {
  return useQuery({
    queryKey:[QUERY_KEY.myInfo],
    queryFn: getMyInfo,
    enabled: !!accessToken, // 토큰 있는 경우에만 실행
  });
}

export default useGetMyInfo;