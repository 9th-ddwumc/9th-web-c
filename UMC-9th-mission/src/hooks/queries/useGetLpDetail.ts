import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpDetail(lpId: number | undefined) {
  return useQuery({
    queryKey: [QUERY_KEY.lp, lpId],
    queryFn: () => getLpDetail(lpId!),
    enabled: !!lpId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: (failureCount, error: any) => {
      // 504이면 재시도 안함
      if (error.response?.status === 504) return false;
      return failureCount < 2;
    },
    select: (res) => res.data.data,
  });
}

export default useGetLpDetail;
