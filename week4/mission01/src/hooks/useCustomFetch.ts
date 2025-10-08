import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useCustomFetch<T>(url: string, config?: AxiosRequestConfig, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
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

    return () => {
      isCancelled = true;
    };
  }, [url, ...(deps || [])]);

  return { data, isLoading, isError };
}