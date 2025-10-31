import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCALSTORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; //요청 재시도 여부를 나타내는 플래그
}

//전역변수로 refresh 요청의 Promise를 저장해서 중복 요청을 방지한다
let refreshPromise: Promise<string> | null = null;

// 기본 서버 주소 설정
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터: 모든 요청 전에 accessToken을 Authorization 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const {getItem} = useLocalStorage(LOCALSTORAGE_KEY.accessToken);
  const accessToken = getItem(); //로컬 스토리지에서 accessToken 가져오기

  //accessToken이 존재하면 요청 헤더에 추가
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  //수정된 요청 설정 반환
  return config;
},
  //요청 인터셉터가 실패하면 에러 반환
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 Unauthorized 응답 처리 -> refresh 토큰을 통한 토큰 갱신 처리
axiosInstance.interceptors.response.use(
  (response) => response, //정상 응답은 그대로 반환
  async (error) => {
    const originalRequest: CustomInternalAxiosConfig = error.config;

    //401 에러이고, 요청이 재시도된 적이 없는 경우에만 토큰 갱신 시도
    if (error.response&&error.response.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === "/v1/auth/refresh") {
        const { removeItem: removeAccessToken } = useLocalStorage(LOCALSTORAGE_KEY.accessToken);
        const { removeItem: removeRefreshToken } = useLocalStorage(LOCALSTORAGE_KEY.refreshToken);

        //리프레시 요청 자체가 401일 경우, 토큰 삭제 후 로그아웃 처리
        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      originalRequest._retry = true; //요청이 재시도되었음을 표시
    
      //이미 리프레시 요청이 진행중이면 그 Promise를 재사용
      if (!refreshPromise) {
        //refresh 요청 실행 후, 프로미스를 전역변수에 할당
        refreshPromise = (async () => {
          const {getItem: getRefreshToken} = useLocalStorage(LOCALSTORAGE_KEY.refreshToken);
          const refreshToken = getRefreshToken();

          const {data} = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });
          const { setItem: setAccessToken } = useLocalStorage(LOCALSTORAGE_KEY.accessToken);
          const {setItem: setRefreshToken} = useLocalStorage(LOCALSTORAGE_KEY.refreshToken);
          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);
          return data.data.accessToken;
        })()
        .catch((error) => {
          const {removeItem: removeAccessToken } = useLocalStorage(LOCALSTORAGE_KEY.accessToken);
          const { removeItem: removeRefreshToken } = useLocalStorage(LOCALSTORAGE_KEY.refreshToken);
          //리프레시 요청이 실패하면 토큰 삭제 후 로그아웃 처리
          removeAccessToken();
          removeRefreshToken();
        })
        .finally(() => {
          //리프레시 요청이 끝나면 전역변수를 초기화
          refreshPromise = null;
        });
      }
      //진행중인 refreshPromise가 해결될 때까지 대기
      return refreshPromise.then((newAccessToken) => {
        //원본 요청의 Authorization 헤더를 새로운 accessToken으로 업데이트
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;;
        //업데이트 된 원본 요청 재시도
        return axiosInstance.request(originalRequest); //원래 요청 재시도
      });
    }
    //401 에러 아닌 경우 그대로 오류 반환
    return Promise.reject(error);
  },
);
