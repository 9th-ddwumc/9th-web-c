import React from "react";

interface LpListFallbackProps {
  type?: "loading" | "error";
  message?: string;
}

/**
 * LP 목록 또는 상세 페이지 로딩/에러 시 공통으로 사용하는 Fallback 컴포넌트
 */
const LpListFallback: React.FC<LpListFallbackProps> = ({ type = "loading" }) => {
  if (type === "error") {
    return (
      <div className="flex flex-col justify-center items-center h-60 text-red-500">
        <p className="text-lg font-semibold mb-2">⚠️ 오류가 발생했습니다</p>
        <p className="text-sm text-gray-400">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  // 기본: 로딩 상태
  return (
    <div className="flex justify-center items-center h-60 text-gray-400 animate-pulse">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-pink-500 rounded-full animate-spin"></div>
        <p className="text-sm text-gray-400">데이터를 불러오는 중입니다...</p>
      </div>
    </div>
  );
};

export default LpListFallback;
