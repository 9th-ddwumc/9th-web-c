import axios from "axios";
import { LOCAL_STRAGE_KEY } from "../constants/key";
import { config } from "zod";
import { useLocalStorage } from "../hooks/useLocalStorage";


export const axiosInstance =axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
    // headers: {
    //         Authorization: `Bearer ${localStorage.getItem(LOCAL_STRAGE_KEY.accessToken)}`,
    //     },
});

axiosInstance.interceptors.request.use((config) => {
    const{getItem} = useLocalStorage(LOCAL_STRAGE_KEY.accessToken);
    const token = getItem();

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});