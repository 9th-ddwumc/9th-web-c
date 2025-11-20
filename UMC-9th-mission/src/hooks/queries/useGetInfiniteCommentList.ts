import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentList } from "../../apis/comment";
import { ResponseCommentListDto } from "../../types/comment";
import { QUERY_KEY } from "../../constants/key";
import { PAGENATION_ORDER } from "../../enums/common";

function useGetInfiniteCommentList(
  lpid: number,
  limit: number,
  order: PAGENATION_ORDER
) {
  return useInfiniteQuery<ResponseCommentListDto>({
    queryKey: [QUERY_KEY.comments, lpid, order],
    queryFn: ({ pageParam }) =>
      getCommentList(lpid, { cursor: typeof pageParam === "number" ? pageParam : undefined, limit, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
  });
}

export default useGetInfiniteCommentList;