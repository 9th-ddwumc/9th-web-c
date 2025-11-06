import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";
import { PAGINATION_ORDER } from "../../enums/common";
import type { CommentPage, ApiResponse } from "../../types/comment";

//fetchLpComments API 호출 함수
const fetchLpComments = async ({
  pageParam = 1,
  lpid,
  order,
}: {
  pageParam: number;
  lpid: string;
  order: PAGINATION_ORDER;
}) => {
  const response = await axiosInstance.get<ApiResponse<CommentPage>>(
    `/lps/${lpid}/comments`,
    {
      params: {
        cursor: pageParam, 
        limit: 10,
        order: order,
      },
    }
  );
  return response.data.data;
};

//무한 쿼리 훅
const useGetInfiniteLpComments = (lpid: string, order: PAGINATION_ORDER) => {
  return useInfiniteQuery({
    //queryKey에 lpid와 order를 포함
    queryKey: ["lpComments", lpid, order],

    //API 호출
    queryFn: ({ pageParam }) =>
      fetchLpComments({ pageParam: pageParam as number, lpid, order }),

    //첫 페이지 번호
   initialPageParam: 0,

    //다음 페이지 번호를 계산하는 로직
    getNextPageParam: (lastPage: CommentPage) => {
      // 'hasNext'가 true이면 'nextCursor'를 반환
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
};

export default useGetInfiniteLpComments;