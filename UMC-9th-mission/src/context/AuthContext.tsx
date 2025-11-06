import { createContext, useState, useContext,type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

//컨텍스트 타입 정의 및 기본값
interface AuthContextType{
    accessToken: string|null;
    refreshToken: string|null;
    login:(signInData:RequestSigninDto) => Promise<void>;
    logout:() => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken:null,
    refreshToken:null,
    login:async()=>{},
    logout:async()=>{},
});

//로컬스토리지에서 초기 토큰 값을 불러와 상태로 초기화.
export const AuthProvider=({children}:PropsWithChildren)=>{
    const{
        getItem:getAccessTokenFromStorage,
        setItem:setAccessTokenInStorage,
        removeItem:removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const{
        getItem:getRefreshTokenFromStorage,
        setItem:setRefreshTokenInStorage,
        removeItem:removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const[accessToken, setAccessToken] = useState<string|null>(
        getAccessTokenFromStorage()//지연초기화
    );
    const[refreshToken, setRefreshToken] = useState<string|null>(
        getRefreshTokenFromStorage()
    );

    const login = async(signinData: RequestSigninDto)=> {
        try{
            //postSignin 호출 후 토큰을 로컬스토리지와 상태에 저장.
            const {data} = await postSignin(signinData);

            if(data){
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                alert("로그인 성공");
                //로그인 성공 시 알림 후 window.location.href="/my"로 이동(전체 리로드).
            }
        }catch(error){
            console.error("로그인 오류", error);
            alert("로그인 실패")
        }
    };

    //로그아웃: 서버 호출 후 로컬 스토리지와 상태를 정리.
    const logout = async() =>{
        try{
            await postLogout()
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            //localStorage.clear(); 지금 상황에서는 이걸 사용해도 되지만 큰사이트의 경우에는 많은걸 담고있기 때문에 권장x
            
            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 성공")
        }catch(error){
            console.error("로그아웃 오류", error);
            alert("로그아웃 실패");
        }
    }
    return(
        //로그인 관련 데이터(accessToken, login, logout)를 앱 전체에서 쓸 수 있게 공유.
        <AuthContext.Provider value = {{accessToken, refreshToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

//컨텍스트에서 값 꺼내 쓰는 커스텀 훅(전역 로그인 정보 불러오는 함수)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }

    return context;
}