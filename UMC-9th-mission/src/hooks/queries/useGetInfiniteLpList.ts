import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { PAGENATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteGetLpList(
  limit: number,
  search: string,
  order: PAGENATION_ORDER
) {
  return useInfiniteQuery({
    queryFn: ({ pageParam }) => 
        getLpList({ cursor:pageParam, search, order, limit }),
    queryKey: [QUERY_KEY.lps, search, order],
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
        //console.log(lastPage, allPages);
        return lastPage.data.hasNext ? lastPage.data.nextCursor:undefined;
    },
    
  });
}

export default useGetInfiniteGetLpList;
