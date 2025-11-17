import { useInfiniteQuery } from "@tanstack/react-query";
import type { PAGINATION_ORDER } from "../../enums/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

//LP 목록을 무한 스크롤로 가져오기 위한 React Query 커스텀 훅
function useGetInfiniteLpList(
    limit:number, 
    search:string, // HomePage로부터 debouncedValue가 이 파라미터로 전달됩니다.
    order:PAGINATION_ORDER,
){
    //공백만 있는지 확인하는 변수
    const isWhitespaceOnly = search !== "" && search.trim() === "";

    return useInfiniteQuery({
        queryFn:({pageParam}) =>
            getLpList({cursor:pageParam, limit, search, order}),
        queryKey:[QUERY_KEY.lps, search, order],
        initialPageParam:0,
        getNextPageParam:(lastPage, allPages) =>{
           // console.log(lastPage, allPages);
            return lastPage.data.hasNext? lastPage.data.nextCursor:undefined;
        },
        
        //공백만 입력된 상태(isWhitespaceOnly가 true)가 아닐 때만 쿼리 실행
        enabled: !isWhitespaceOnly,

        //  staleTime/gcTime 설정 (v5+ 기준 gcTime)
        // 데이터를 5분간 "fresh" 상태로 유지 (불필요한 재요청 방지)
        staleTime: 1000 * 60 * 5, 
        // 쿼리가 비활성화된 후 10분간 캐시 유지
        gcTime: 1000 * 60 * 10,
      
    });
}

export default useGetInfiniteLpList;