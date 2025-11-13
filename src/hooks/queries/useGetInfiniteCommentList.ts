import { useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_ORDER } from "../../enums/common"
import { axiosInstance } from "../../apis/axios";
import type { CommentsResponse } from "../../types/lpComment";

function useGetInfiniteCommentList(lpId: number, limit: number, order: PAGINATION_ORDER) {
  return useInfiniteQuery({
    queryKey: ["lpComments", lpId, order],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axiosInstance.get<CommentsResponse>(
        `/v1/lps/${lpId}/comments`,
        {
          params: {
            cursor: pageParam,
            limit,
            order,
          },
        }
      );
      return response.data.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.hasNext ? lastPage.nextCursor : undefined;
    },
    initialPageParam: 0,
  });
}

export default useGetInfiniteCommentList;