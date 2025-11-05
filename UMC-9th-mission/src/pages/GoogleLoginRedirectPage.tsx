import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

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