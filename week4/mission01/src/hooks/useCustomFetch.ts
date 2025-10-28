import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useCustomFetch<T>(url: string, config?: AxiosRequestConfig, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isCancelled = false; //컴포넌트 언마운트 시 상태 업데이트 방지용

    const fetchData = async () => { //실제 네트워크 호출 로직
      setIsLoading(true);
      setIsError(false);

      try {
        const response = await axios.get<T>(url, config);
        if (!isCancelled) setData(response.data);
      } catch {
        if (!isCancelled) setIsError(true);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchData();

    return () => { //언마운트 시 isCancelled = true 로 플래그 변경
      isCancelled = true;
    };
  }, [url, ...(deps || [])]);

  return { data, isLoading, isError };
}