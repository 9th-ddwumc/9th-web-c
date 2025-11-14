import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCALSTORAGE_KEY } from "../constants/key";

const GoogleLoginRedirectPage = ()=>{
    const {setItem:setAccessToken} = useLocalStorage(
        LOCALSTORAGE_KEY.accessToken,
    );
    const {setItem:setRefreshToken} = useLocalStorage(
        LOCALSTORAGE_KEY.refreshToken,
    );

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);//주소창에 ?뒤에 부분을 받음
        const accessToken = urlParams.get(LOCALSTORAGE_KEY.accessToken);
        const refreshToken = urlParams.get(LOCALSTORAGE_KEY.refreshToken);

        if(accessToken){
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            window.location.href="/my";
        }

    },[setAccessToken,setRefreshToken]);
    return(
        <div>
            구글 로그인 리다이렉 화면
        </div>
    );
};

export default GoogleLoginRedirectPage;