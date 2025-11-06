import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGENATION_ORDER } from "../enums/common";
import { Heart } from "lucide-react";
import { OrderButton } from "../components/OrderButton";

const HomePage = () => {
  const [order, setOrder] = useState(PAGENATION_ORDER.desc); // ✅ 기본 최신순
  const { data, isPending, isFetching, isError, refetch } = useGetLpList({ order });
  const navigate = useNavigate();

  // ✅ 로딩 상태
  if (isPending || isFetching) {
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
    <div className="w-full">
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
        {data?.map((lp) => (
          <div
            key={lp.id}
            onClick={() => navigate(`/lp/${lp.id}`)} // ✅ 카드 클릭 시 라우팅
            className="relative overflow-hidden rounded-2xl shadow-md transition-transform duration-300 hover:scale-105 group cursor-pointer"
          >
            {/* LP 썸네일 */}
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Hover 오버레이 + 메타 정보 */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              {/* 제목 (두 줄 + ellipsis) */}
              <h3
                className="text-white text-lg font-semibold line-clamp-2"
                title={lp.title}
              >
                {lp.title}
              </h3>

              {/* 업로드일 + 좋아요 */}
              <div className="flex justify-between items-center text-sm text-gray-200 mt-2">
                <span>
                  {new Date(lp.createdAt).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span>{lp.likes?.length ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
