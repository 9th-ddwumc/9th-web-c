import {useMutation } from "@tanstack/react-query";
import { postLike } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { Variable } from "lucide-react";

function usePostLike() {
    return useMutation({
        mutationFn: postLike,
        //retry:3 >요청 실패 시 재시도 횟수
        //retryDelat:0 -> 몇초마다 재시도 할거냐

        //data -> API 성공 응답데이터
        //variables -> mutate 에 전달한 값
        //context -> onMutate에서 반환한 값
        onSuccess: (data,variables,context) => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEY.lps, data.data.lpId],
                exact:true, //기본값 false(뭐리키가 부분적을 일치하면 무효화), true일경우 쿼리키가 완전 동일한 쿼리만 무효화
            }/*무효화 할 것이 더 있을 경우 여기에 queryClient.invalidateQueries 추가해서 하면됨*/ );
        },

        //error -> 요청 실패시 발생한 에러
        //variables -> mutate에 전달한 값
        //context -> onMutate에서 반환한 값
        onError:(error, variables, context) => {},
        
        //요청 직전에 실행되기 직전에 실행되는 함수(지금의 경우는 좋아요 요청 직전)
        //Optimistic Update를 구현할 때 유용
        onMutate: (variables)=>{
            console.log("hi");
        },

        //요청이 끝난 후 항상 실행됨(OnSuccess, onError후에 실행됨)
        //로딩 상태에 초기화할 때 조금 유용하다.
        onSettled:(data,error,variables,context) => {},
    });
}

export default usePostLike;