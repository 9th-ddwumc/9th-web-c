import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchLpDetail } from "../apis/lp"; // 상세 API
import LpListFallback from "../components/LpListFallback"; // 로딩/에러 공용 컴포넌트
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const LpDetailPage = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    </div>
  );
};

export default LpDetailPage;
