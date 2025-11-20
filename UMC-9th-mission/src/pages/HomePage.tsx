import { useCallback, useState, useEffect } from "react";
import { PAGENATION_ORDER } from "../enums/common";
import { OrderButton } from "../components/OrderButton";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import SearchBar from "../components/SearchBar";
import useDebounce from "../hooks/useDebounce";
import useGetInfiniteGetLpList from "../hooks/queries/useGetInfiniteLpList";

const HomePage = () => {
  const [order, setOrder] = useState(PAGENATION_ORDER.desc);
  const [search, setSearch] = useState("");

  // 500ms 디바운스
  const debouncedValue = useDebounce(search, 300);

  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
  }, []);

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    isError,
    fetchNextPage,
  } = useGetInfiniteGetLpList(5, debouncedValue, order); // debouncedValue 전달

  const { ref, inView } = useInView({ threshold: 0 });

  // 무한 스크롤
  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-300 text-lg">로딩 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-white">
        <p className="text-lg mb-4">데이터를 불러오는 중 오류가 발생했습니다 😢</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen pt-20">
      {/* 검색창 */}
      <SearchBar value={search} onChange={handleSearchChange} />

      {/* 정렬 버튼 */}
      <OrderButton order={order} setOrder={setOrder} />

      {/* LP 리스트 */}
      <div className="p-5 grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-6">
        {lps?.pages
          .map((page) => page.data.data)
          .flat()
          .map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        {isFetching && <LpCardSkeletonList count={10} />}
      </div>

      <div ref={ref} className="h-2"></div>
    </div>
  );
};

export default HomePage;
