import axios from "axios";
import { LOCALSTORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // 요청 시점에 읽음
  if (token) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(LOCALSTORAGE_KEY.accessToken)}`;
  }
  return config;
});
