import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY, QUERY_KEY } from "../constants/key";
import { postLogout, postSignin, getMyInfo } from "../apis/auth";
import type { RequestSigninDto } from "../types/auth";
import { queryClient } from "../App";

// AuthContext.tsx
interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  login: (signinData: RequestSigninDto) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const {
    getItem: getAccessTokenFromStorage,
    setItem: setAccessTokenInStorage,
    removeItem: removeAccessTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

  const {
    getItem: getRefreshTokenFromStorage,
    setItem: setRefreshTokenInStorage,
    removeItem: removeRefreshTokenFromStorage,
  } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

  const [accessToken, setAccessToken] = useState(getAccessTokenFromStorage());
  const [refreshToken, setRefreshToken] = useState(getRefreshTokenFromStorage());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessTokenFromStorage();
      if (token) {
        try {
          // React Query로 prefetch (캐시에 저장만 함)
          await queryClient.prefetchQuery({
            queryKey: [QUERY_KEY.myInfo],
            queryFn: getMyInfo,
          });
        } catch (error) {
          console.error("유저 정보 가져오기 실패", error);
          // 토큰이 만료되었을 수 있으므로 제거
          removeAccessTokenFromStorage();
          removeRefreshTokenFromStorage();
          setAccessToken(null);
          setRefreshToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // ✅ 로그인
  const login = async (signinData: RequestSigninDto) => {
    const { data } = await postSignin(signinData);
    if (data) {
      // 토큰 저장
      setAccessTokenInStorage(data.accessToken);
      setRefreshTokenInStorage(data.refreshToken);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      
      // 로그인 후 유저 정보 prefetch
      queryClient.prefetchQuery({
        queryKey: [QUERY_KEY.myInfo],
        queryFn: getMyInfo,
      });
    }
  };

  // ✅ 로그아웃
  const logout = async () => {
    try {
      await postLogout();
      removeAccessTokenFromStorage();
      removeRefreshTokenFromStorage();
      setAccessToken(null);
      setRefreshToken(null);
      
      // 로그아웃 시 유저 정보 캐시 제거
      queryClient.removeQueries({ queryKey: [QUERY_KEY.myInfo] });
      
      alert("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 실패", error);
      alert("로그아웃 실패");
    }
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext를 찾을 수 없습니다.");
  return context;
};