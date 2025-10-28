import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

// 기본 서버 주소 설정
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 토큰을 자동으로 헤더에 포함
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
