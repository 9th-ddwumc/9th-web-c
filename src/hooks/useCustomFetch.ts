import {useQuery} from '@tanstack/react-query';

export function useCustomFetch<T>(url: string){
    return useQuery( {
        queryKey: [url],

        queryFn: async ({signal}) => {
            const response = await fetch(url, {signal});
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json() as Promise<T>;
        },

        retry: 10,

        retryDelay: (attemptIndex) => {
            return Math.min(1000 * Math.pow(2, attemptIndex), 30000);
        },

        staleTime: 5 * 60 * 1000, //5 minutes

        //쿼리 사용되지 않은 채로 10분 지나면 캐시에서 제거
        gcTime: 10 * 60 * 1000, //30 minutes
    })
}