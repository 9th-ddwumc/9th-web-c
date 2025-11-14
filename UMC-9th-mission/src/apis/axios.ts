import axios, { type InternalAxiosRequestConfig } from "axios";

interface CustomInternalAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 전역변수로 refresh 요청 Promise를 저장해서 중복 요청 방지
let refreshPromise: Promise<string> | null = null;

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

// 요청 인터셉터: 모든 요청에 accessToken 붙이기
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 처리 + refreshToken 재발급
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosConfig = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // refresh 요청 자체가 401일 때는 토큰 삭제 후 로그인 페이지 이동
      if (originalRequest.url === "/v1/auth/refresh") {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          // refreshToken 없으면 로그아웃 처리
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          window.location.href = "/login";
          return Promise.reject(error);
        }

        refreshPromise = axiosInstance
          .post("/v1/auth/refresh", { refresh: refreshToken })
          .then((res) => {
            const newAccessToken = res.data.data.accessToken;
            const newRefreshToken = res.data.data.refreshToken;

            localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

            return newAccessToken;
          })
          .catch(() => {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            window.location.href = "/login";
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise.then((newAccessToken) => {
        if (!newAccessToken) return Promise.reject(error);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }

    return Promise.reject(error);
  }
);
