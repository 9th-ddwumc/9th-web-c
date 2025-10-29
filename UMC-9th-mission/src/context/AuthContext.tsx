import { type RequestSigninDto } from "../types/auth";
import {createContext, useContext, useState, type PropsWithChildren} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCALSTORAGE_KEY } from "../constants/key";
import { postLogout, postSignin } from "../apis/auth";

interface AuthContextType{
    accessToken: string | null;
    refreshToken: string | null;
    login: (signinData:RequestSigninDto) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext: React.Context<AuthContextType> = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    login: async() => {},
    logout: async() => {},
});

export const AuthProvider = ({children}:PropsWithChildren) => {

    const {getItem:getAccessTokenFromStorage, 
        setItem:setAccessTokenInStorage, 
        removeItem: removeAccessTokenFromStorage} = useLocalStorage(LOCALSTORAGE_KEY.accessToken);
    const {getItem:getRefreshTokenFromStorage, 
        setItem:setRefreshTokenFromStorage,
        removeItem: removeRefreshTokenFromStorage
    } = useLocalStorage(LOCALSTORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken] = useState<string | null>(
        getAccessTokenFromStorage()
    );
    const [refreshToken, setRefreshToken] = useState<string | null>(
        getRefreshTokenFromStorage()
    );

    const login = async(signinData: RequestSigninDto) => {
        
        try{
            const {data} = await postSignin(signinData);

            if (data){
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;

                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenFromStorage(newRefreshToken);
                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                alert("로그인에 성공했습니다.");
                window.location.href = "/my";
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("로그인에 실패했습니다. 다시 시도해주세요.");
        }
        
    }

    const logout = async() => {
        try{
            await postLogout();

            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            setAccessToken(null);
            setRefreshToken(null);
            alert("로그아웃 되었습니다.");
        } catch (error){
            console.error("Logout error:", error);
            alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
        }
    }

    return (
        <AuthContext.Provider value={{accessToken, refreshToken, login, logout}}>
            {children}
        </AuthContext.Provider>
    )

    
}
export const useAuth = () => {
        const context: AuthContextType = useContext(AuthContext);
        if (!context) {
            throw new Error("useAuth must be used within an AuthProvider");
        }
        return context;
}