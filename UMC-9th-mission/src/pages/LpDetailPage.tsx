import { useParams } from "react-router-dom";
import { Heart, Edit2, Trash2 } from "lucide-react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import Comment from "../components/Comment/Comment";

const LpDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const lpIdNumber = id ? Number(id) : undefined;

  const { data: lpDetail, isPending, isError, refetch } = useGetLpDetail(lpIdNumber);

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
  if (isError || !lpDetail) {
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

  // ✅ 데이터 정상 렌더링
  return (
    <div className="pb-10 mt-20">
    <div className="bg-[#1f1f1f] rounded-3xl max-w-3xl mx-auto p-6 text-white space-y-6">
      {/* 상단 정보 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            src={lpDetail.author.avatar ?? "/default-avatar.png"}
            alt={lpDetail.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-semibold">{lpDetail.author.name}</span>
        </div>
        <div className="text-gray-400 text-sm">
          {new Date(lpDetail.createdAt).toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>

      {/* 제목 + 아이콘 */}
      <div className="flex justify-between items-center">
  {/* 제목 */}
  <h1 className="text-3xl font-bold">{lpDetail.title}</h1>

  {/* 아이콘 그룹 */}
  <div className="flex gap-3">
    <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
      <Edit2 className="w-5 h-5" />
    </div>
    <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">
      <Trash2 className="w-5 h-5" />
    </div>
  </div>
</div>

      {/* 썸네일 / LPPlayer */}
      <div className="w-full flex justify-center items-center my-6">
        <div className="relative w-64 h-64 bg-[#2a2a2a] rounded-2xl shadow-xl flex items-center justify-center">
          <div className="relative w-60 h-60 rounded-full overflow-hidden border-4 border-gray-500 shadow-2xl bg-black flex items-center justify-center">
            <img
              src={lpDetail.thumbnail}
              alt="CD Thumbnail"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center">
              ▶
            </div>
          </div>
        </div>
      </div>

      {/* 곡 설명 */}
      <p className="text-gray-300 text-lg leading-relaxed line-clamp-3">{lpDetail.content}</p>

      {/* 좋아요 */}
      <div className="flex justify-center items-center mt-4 gap-2">
        <Heart className="w-6 h-6 text-pink-400" />
        <span className="text-white font-semibold">{lpDetail.likes?.length ?? 0}</span>
      </div>

      {/*댓글*/}
      {lpIdNumber !== undefined && <Comment lpid={lpIdNumber} />}
    </div>
    </div>
  );
};

export default LpDetailPage;
