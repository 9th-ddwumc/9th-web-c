import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCustomFetch<T>(
  url: string | null,
  headers?: Record<string, string>
): { data: T | null; isPending: boolean; isError: boolean } {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!url) return;
    
    const fetchData = async () => {
      setIsPending(true);
      setIsError(false);
      
      try {
        const res = await axios.get<T>(url, { headers });
        setData(res.data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };
    
    fetchData();
  }, [url]);

  return { data, isPending, isError };
}