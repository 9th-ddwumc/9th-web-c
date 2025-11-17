import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

//LP 목록의 특정 페이지(페이지네이션 정보 기반)를 가져오기 위한 React Query 커스텀 훅
function useGetLpList({cursor, search, order, limit}:PaginationDto){
    return useQuery({
        queryKey:[QUERY_KEY.lps, search, order],
        queryFn: () => 
            getLpList({
                 cursor,
                search,
                order,
                limit,
            }),
            //staleTime (데이터 신선도 유지 시간):
            //데이터가 'fresh'(신선함) 상태로 유지되는 시간 
            //5분 이내에는 이 훅이 다시 마운트되어도 'queryFn'이 실행되지 않고 캐시된 데이터를 즉시 반환함
            staleTime:1000*60*5,
            //gcTime (Garbage Collection Time, 캐시 유지 시간):
            //데이터가 'inactive'(비활성, 화면에서 사용되지 않음) 상태가 되었을 때,
            //캐시에서 제거되기 전까지 유지되는 시간
            //'staleTime'보다 항상 길게 설정해야 함
            gcTime:1000*60*10,


            //select (데이터 선택/가공 함수):
            //'queryFn'이 성공적으로 데이터를 가져왔을 때(API 응답 원본 데이터),
            //실제 컴포넌트에 반환되기 '전에' 데이터를 가공하는 함수
            select: (data) => data?.data?.data ?? [],//select에서 data.data.data 접근 시 optional chaining을 쓰면 에러 방지 가능

        
    });
}

export default useGetLpList;

