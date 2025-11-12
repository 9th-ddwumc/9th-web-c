import { useEffect, useState } from "react";
import axios from "axios";

/**
 * T: 실제 데이터 타입 (예: Movie[])
 * R: API 전체 응답 타입 (예: MovieResponse)
 */
interface UseCustomFetchResult<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

/**
 * 자동으로 `data.results`를 꺼내주는 fetch 훅
 */
export function useCustomFetch<T, R = T>(
  url: string,
  deps: any[] = []
): UseCustomFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);

      try {
        const response = await axios.get<R>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });

        
        const extractedData = (response as any).data?.results ?? (response as any).data;
        setData(extractedData);
      } catch (error) {
        console.error("Fetch error:", error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, deps);

  return { data, isPending, isError };
}
