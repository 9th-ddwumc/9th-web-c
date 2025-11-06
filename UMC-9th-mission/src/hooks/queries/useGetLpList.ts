import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { PagenationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ cursor, search, order, limit }: PagenationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, order],
    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),

    // ✅ 캐싱 옵션
    staleTime: 1000 * 60 * 5, // 5분 동안 신선 데이터 유지
    gcTime: 1000 * 60 * 10, // 10분 후 메모리에서 제거
    placeholderData: keepPreviousData,

    // ✅ 필요한 데이터만 선택
    select: (data) => data.data.data,

    // ✅ 재시도 로직 커스터마이징
    retry: (failureCount, error: any) => {
      // 2회 이상 실패 시 중단
      if (failureCount >= 2) return false;

      // 서버 응답이 없는 경우 (네트워크 오류 등) → 중단
      if (!error?.response) return false;

      // 그 외에는 한 번 더 시도
      return true;
    },

    // ✅ 에러 발생 시 바로 stale로 처리
    retryDelay: 2000, // 재시도 사이 간격 2초
  });
}

export default useGetLpList;



/*
function useGetLpList({cursor, search, order, limit} : PagenationDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps],
        queryFn: () => 
            getLpList({
            cursor,
            search,
            order,
            limit,
        }),
        //데이터가 신선하다고 간주하는 시간
        //이 시간 동안은 캐시된 데이터를 그대로 사용, 컴포넌트가 마운트되거나 창에 포커스 들어오는 경우도 재요청 X
        //5분 동안 기존 데이터를 그대로 활용해서 네트워크 요청을 줄인다
        staleTime: 1000 * 60 * 5, // 5 minutes
        //사용되지 않는 (비활성 상태)인 쿼리 데이터가 캐시에 남아있는 시간
        //staleTime이 지나고 데이터가 신선하지 않더라도, 일정 시간 동안 메모리에 보관
        //그 이후에 해당 쿼리가 전혀 사용되지 않으면 gc-Time이 지난 후에 제거한다.(garbage collection)
        //예) 10분 동안 사용되지 않으면 메모리에서 제거, 다시 요청 시 새 데이터를 받아오게 함
        gcTime: 1000 * 60 * 10, // 10 minutes

        //조건에 따라 쿼리 실행 여부 제어
        //enabled: Boolean(search),
        //refetchInterval: 100 * 60

        //retry: 쿼리 요청이 실패했을 때 자동으로 재시도할 횟수를 지정함
        //기본값은 3회 정도, 네트워크 상태가 불안정할 때 유용
        
        //initialData 쿼리 실행 전 미리 제공할 초기 데이터 설정
        //컴포넌트가 렌더링 될 ㄸ ㅐ빈 데이터 구조를 미리 제공해서 로딩 전에도 안전하게 UI를 렌더링

        //파라미터가 변경될 때 이전 데이터를 유지하여 UI깜빡임을 줄여줌
        //ex) 페이지네이션 시 페이지 전환 사이에 이전 데이터를 보여주어 사용자 경험 향상
        //keepPreviousData: true, 이전 데이터를 유지하면서 새로운 데이터를 로드

        select: (data) => data.data.data,

    });
}
*/
