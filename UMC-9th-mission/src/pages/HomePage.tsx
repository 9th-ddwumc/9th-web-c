import { useEffect, useState } from "react";
import { PAGENATION_ORDER } from "../enums/common";
import { OrderButton } from "../components/OrderButton";
import useGetInfiniteGetLpList from "../hooks/queries/useGetInfiniteLpList";
import {useInView} from 'react-intersection-observer'
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";

const HomePage = () => {
  const [order, setOrder] = useState(PAGENATION_ORDER.desc); // ✅ 기본 최신순
  const [search, setSearch] = useState("");
  //const { data, isPending, isFetching, isError, refetch } = useGetLpList({ order, limit:50 });
  const { data:lps, isFetching, hasNextPage, isPending, fetchNextPage, isError, refetch } = useGetInfiniteGetLpList(5, search, order)

  //ref, inView
  //ref -> 특정한 HTML 요소를 감시할 수 있다.
  //inView -> 그 요소가 화면에 보이면 true
  const {ref, inView} = useInView({
    threshold:0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  },[inView, isFetching, hasNextPage, fetchNextPage])

  // ✅ 로딩 상태
  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300 text-lg">로딩 중...</p>
      </div>
    );
  }

  // ✅ 에러 상태
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-white">
        <p className="text-lg mb-4">데이터를 불러오는 중 오류가 발생했습니다 😢</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#ed2463] rounded-md hover:bg-[#c91e54] transition-colors duration-200"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  // ✅ 정상 렌더링
  return (
    <div className="w-full pt-20">
      {/* 정렬 버튼 */}
      <OrderButton order={order} setOrder={setOrder} />

      {/* LP 리스트 */}
      <div
        className="
          p-5
          grid
          lg:grid-cols-6 
          md:grid-cols-5 
          sm:grid-cols-4
          grid-cols-3
          gap-6
        "
      >
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
          <LpCard key={lp.id} lp={lp}/>
        ))}
        
      </div>
      {isFetching && <LpCardSkeletonList count={10} />}
      <div ref={ref} className="h-2"></div>
    </div>
      
  );
};

export default HomePage;
