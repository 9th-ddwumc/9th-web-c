import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../../enums/common";
import { axiosInstance } from "../../apis/axios";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(limit: number, search: string, order: PAGINATION_ORDER) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axiosInstance.get("/v1/lps", {
        params: {
          cursor: pageParam,
          limit,
          search: search || undefined,
          order,
        },
      });
      return response.data;
    },
    // ✅ 공백만 있으면 요청 안 함
    enabled: search === "" || search.trim().length > 0,
    getNextPageParam: (lastPage) => lastPage?.data?.hasNext ? lastPage.data.nextCursor : undefined,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetInfiniteLpList;