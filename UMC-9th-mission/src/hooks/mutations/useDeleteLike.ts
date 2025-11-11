import {useMutation } from "@tanstack/react-query";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";
import { deleteLike } from "../../apis/lp";
import {type Likes, type RequestLpDto, type ResponseLpDto } from "../../types/lp";
import type { ResponseMyInfoDto } from "../../types/auth";
import { PrefetchPageLinks } from "react-router-dom";
import { da } from "zod/v4/locales";
import { ConeIcon, Variable } from "lucide-react";

function useDeleteLike() {
    return useMutation({
        mutationFn: deleteLike,

        /**낙관적 업데이트 적용 */
        //onMutate -> API 요청이전에 호출되는 친구
        //UI에 바로 변경을 보여주기 위해 Cache업데이트
        onMutate: async(lp:RequestLpDto) => {
            //1.이 게시글에 관련된 쿼리들 취소(캐시된 데이터를 새로 불러오는 요청)
            await queryClient.cancelQueries({
                queryKey:[QUERY_KEY.lps, lp.lpId],
            });

            //2.현재 게시글의 데이터(롤백 해야할)를 캐시에서 가져와야함
            const previousLpPost = queryClient.getQueryData<ResponseLpDto>([
                QUERY_KEY.lps,
                lp.lpId,
            ]);
            
            //게시글 데이터를 복사해서 NewLpPost라는 새로운 객체를 만들거임
            //복사하는 가장 큰 이유는 나중에 오류가 발생했을때 이전 상태로 되돌리기 위해서다
            const newLpPost = {...previousLpPost};

            //게시글에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치를 찾아야한다.
            const me = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.myInfo]);
            //console.log(me?.data.id)//내userid
            const userId = Number(me?.data.id);

            const likedIndex = previousLpPost?.data.likes.findIndex(
                (like) => like.userId === userId,
            ) ??-1;//userId를 못찾으면 -1 반환

            if(likedIndex >= 0){ //>0으로 하면 0번인덱스를 인식못해서 배열이 쌓이게됨
                previousLpPost?.data.likes.splice(likedIndex, 1);//likes에서 내 userId 없애기
            } else{
                const newLike = {userId, lpId:lp.lpId} as Likes;//Likes로 타입캐스팅함
                previousLpPost?.data.likes.push(newLike);//likes에 내가 잇던거처럼 밀어넣음
            }

            console.log(newLpPost)
            //업데이트된 게시글 데이터를 캐시에 저장
            //이렇게하면 UI가 바로 업데이트됨, 사용자가 변화를 확인할 수 있다.
            queryClient.setQueryData([QUERY_KEY.lps,lp.lpId], newLpPost);

            //문제가 생겼을때?
            return {previousLpPost, newLpPost};
        },

        //에러생겻을때 롤백
        onError:(err, newLp, context) =>{
            console.log(err, newLp);
            queryClient.setQueryData(
                [QUERY_KEY.lps, newLp.lpId],
                context?.previousLpPost?.data.id,
            );
        },

        //onSettled는 API 요청이 끝난 후 (성공하든 실패하든 실행)(서버 동기화)
        onSettled :async(data, error, variables, context) => {
            await queryClient.invalidateQueries({
                queryKey:[QUERY_KEY.lps,variables.lpId],
            })
        },
        

        /**낙관적업데이트 미적용 */
        // onSuccess: (data) => {
        //     queryClient.invalidateQueries({
        //         queryKey:[QUERY_KEY.lps, data.data.lpId],
        //         exact:true,
        //     });
        // },
    });
}

export default useDeleteLike;