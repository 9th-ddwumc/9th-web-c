import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; //요청 재시도 여부 나타내는 플래그
}

let refreshPromise: Promise<string> | null = null;

// 기본 서버 주소 설정
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 토큰을 자동으로 헤더에 포함
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
  },
  (error) => Promise.reject(error),
);

// 토큰 갱신 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async(error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (originalRequest.url === '/vl/auth/refresh') {
        const { removeItem: removeAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.accessToken
        );
        const { removeItem: removeRefreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken
        );
        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async() => {
          const { getItem: getRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );
          const refreshToken = getRefreshToken();

          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });
          const { setItem: setAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken,
          );
            const { setItem: setRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );
          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);

          return data.data.accessToken;
        })().catch((error) => {
          const { removeItem: removeAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken,
          );
          const { removeItem: removeRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken,
          );
          removeAccessToken();
          removeRefreshToken();
        })
        .finally(() => {
          refreshPromise = null;
        });
      }
      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }
    return Promise.reject(error);
  },
)