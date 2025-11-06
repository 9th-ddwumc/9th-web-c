import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLpDetail } from "../apis/lp"; // 상세 API
import LpListFallback from "../components/LpListFallback"; // 로딩/에러 공용 컴포넌트
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PAGINATION_ORDER } from "../enums/common";
import CommentList from "../components/LpComment/CommentList";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // lpid가 없을 경우 안전하게 분기
  if (!lpid) {
    return <LpListFallback type="error" message="잘못된 접근입니다." />;
  }
  
  //댓글 표시/숨김 상태 (기본값: false)
  const [isCommentVisible, setIsCommentVisible] = useState(false);

  // 댓글 정렬 상태 (기본: 최신순)
  const [commentOrder, setCommentOrder] = useState<PAGINATION_ORDER>(
    PAGINATION_ORDER.desc
  );
  // 비로그인 접근 시 경고 모달 띄우기
  useEffect(() => {
    if (!accessToken) {
      const confirmLogin = window.confirm("로그인이 필요합니다. 로그인하시겠습니까?");
      if (confirmLogin) {
        navigate("/login", { state: { from: location.pathname } }); // 로그인 후 돌아올 경로 저장
      } else {
        navigate("/");
      }
    }
  }, [accessToken, navigate, location]);

  // 로그인 안 되어 있으면 내용 표시 안 함
  if (!accessToken) return null;

  // 상세 페이지 데이터 패칭
  const { data, isLoading, isError } = useQuery({
    queryKey: ["lp", lpid],
    queryFn: () => fetchLpDetail(lpid!),
  });
  //  안전하게 분기 처리
  if (isLoading) return <LpListFallback type="loading" />;
  if (isError || !data) return <LpListFallback type="error" />;

  const lp = data.data; //  data가 존재함이 보장됨 

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 text-white">
      {/* 썸네일 */}
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-80 object-cover rounded-lg shadow-lg"
      />

      {/* 제목 + 메타 정보 */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{lp.title}</h1>
        <div className="text-gray-400 text-sm">
          {new Date(lp.createdAt).toLocaleDateString()} · {lp.likes.length} ♥️
        </div>
      </div>

      {/* 본문 */}
      <div className="prose prose-invert text-gray-200 whitespace-pre-line">
        {lp.content}
      </div>

      {/* 버튼 */}
      <div className="flex space-x-3 mt-4">
        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">
          수정
        </button>
        <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition">
          삭제
        </button>
        <button className="px-4 py-2 bg-pink-600 rounded hover:bg-pink-700 transition">
          좋아요
        </button>
      </div>

      {/* ========== 댓글 섹션 ========== */}
      {/*댓글 토글 버튼 */}
      <div className="mt-12 border-t border-gray-700 pt-6">
        <button 
          onClick={() => setIsCommentVisible(!isCommentVisible)}
          className="text-xl font-semibold mb-4 text-white hover:text-pink-400 transition"
        >
          댓글 {isCommentVisible ? "숨기기 🔼" : "보기 🔽"}
        </button>

        {/*isCommentVisible이 true일 때만 댓글 영역을 렌더링 */}
        {isCommentVisible && (
          <div className="mt-4">
    {/* 정렬 버튼 */}
    <div className="flex gap-2 mb-4">
    <button
    onClick={() => setCommentOrder(PAGINATION_ORDER.desc)}
    className={`px-3 py-1 rounded ${
    commentOrder === PAGINATION_ORDER.desc
        ? "bg-pink-600 text-white"
      : "bg-gray-700 text-gray-300"
      }`}
        >
    최신순
      </button>
    <button
    onClick={() => setCommentOrder(PAGINATION_ORDER.asc)}
    className={`px-3 py-1 rounded ${
    commentOrder === PAGINATION_ORDER.asc
    ? "bg-pink-600 text-white"
    : "bg-gray-700 text-gray-300"
    }`}
    >
    오래된순
    </button>
    </div>

    {/*댓글 리스트 컴포넌트 */}
    {/* lpid가 있을 때만 렌더링 (이미 상단에서 분기 처리됨) */}
    <CommentList lpid={lpid} order={commentOrder} />
          </div>
        )}
    </div>

  </div>
  );
};

export default LpDetailPage;