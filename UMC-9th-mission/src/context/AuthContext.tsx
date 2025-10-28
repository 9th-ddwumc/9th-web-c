import { createContext, useState, useContext,type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

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
            const {data} = await postSignin(signinData);

            if(data){
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                alert("로그인 성공");
                window.location.href="/my";
            }
        }catch(error){
            console.error("로그인 오류", error);
            alert("로그인 실패")
        }
    };

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
        <AuthContext.Provider value = {{accessToken, refreshToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }

    return context;
}