import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";
import { PAGINATION_ORDER } from "../../enums/common";
import type { CommentPage, ApiResponse } from "../../types/comment";

//특정 LP의 댓글 목록을 한 페이지(페이지네이션)만큼 가져오는 API 호출 함수
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
    `/v1/lps/${lpid}/comments`,
    {
        //요청 시 URL에 쿼리 파라미터(Query Parameter)로 보낼 데이터
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
//'lpid'와 'order'가 주어지면, 해당 LP의 댓글 목록을 무한 스크롤로 관리하는 React Query 훅
const useGetInfiniteLpComments = (lpid: string, order: PAGINATION_ORDER) => {
  return useInfiniteQuery({
    //Query Key (쿼리 키): React Query가 이 데이터를 캐싱하는 고유한 이름(Key).
    // 배열로 구성되며, "lpComments"라는 이름표에 lpid와 order를 조합함
    //     만약 lpid나 order가 바뀌면, React Query는 새 데이터로 간주하고 다시 가져옴
    queryKey: ["lpComments", lpid, order], //데이터찍어보기

    //Query Function (쿼리 함수): 실제 데이터를 가져올 함수를 지정
    queryFn: ({ pageParam }) =>
      fetchLpComments({ pageParam: pageParam as number, lpid, order }),

    //첫 페이지 번호
    //여기서는 0으로 설정되어, 첫 API 요청 시 cursor=0 으로 요청
   initialPageParam: 0,

    //다음 페이지 번호를 계산하는 로직
    getNextPageParam: (lastPage: CommentPage) => {
      // 'hasNext'가 true이면 'nextCursor'를 반환
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
};

export default useGetInfiniteLpComments;