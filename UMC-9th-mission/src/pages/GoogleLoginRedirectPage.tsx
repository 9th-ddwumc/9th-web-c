import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

/**
 * 구글(또는 다른 OAuth) 로그인 성공 후 리다이렉트되는 '중간 처리' 페이지
 * 이 페이지는 사용자에게 거의 보이지 않고(잠깐 스쳐 지나감),
 * URL에 포함된 토큰을 로컬 스토리지에 저장한 뒤,
 * 사용자를 최종 목적지로 다시 리다이렉트시키는 역할만 함
 */

const GoogleLoginRedirectPage = ()=>{
    const {setItem:setAccessToken} = useLocalStorage(
        LOCAL_STORAGE_KEY.accessToken,
    );
    const {setItem:setRefreshToken} = useLocalStorage(
        LOCAL_STORAGE_KEY.refreshToken,
    );

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);//주소창에 ?뒤에 부분을 받음
        const accessToken = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
        const refreshToken = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);
        const from = urlParams.get("from"); // 로그인 전 가려던 경로

        if(accessToken){
            //읽은 토큰을 로컬스토리지에 저장.
            setAccessToken(accessToken);
             if (refreshToken) {
                setRefreshToken(refreshToken);
            }
            // 원래 가려던 경로가 있으면 그쪽으로, 없으면 기본 마이페이지로 이동
            const targetUrl = from || "/my";
            //'replace'를 사용하는 이유:
            //'replace'는 현재 페이지(이 리다이렉트 페이지)를 브라우저 방문 기록(history)에 남기지 않는다.
            // 따라서 사용자가 '뒤로 가기' 버튼을 눌렀을 때, 이 토큰 처리 페이지로 다시 돌아오는 것을 방지할 수 있다.
            window.location.replace(targetUrl);
        }
   
    },[setAccessToken,setRefreshToken]);
    return(
        <div>
            구글 로그인 리다이렉트 화면
        </div>
    );
};

export default GoogleLoginRedirectPage;