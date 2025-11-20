const CommentSkeleton = () => {
  return (
    <div className="space-y-4 relative overflow-hidden rounded-2xl shadow-md animate-pulse">
      {/* 댓글 3개 정도 스켈레톤으로 표시 */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border-b border-gray-700 pb-2 animate-pulse"
        >
          {/* 작성자 영역 */}
          <div className="flex items-center gap-2 mb-2">
            {/* 프로필 이미지 자리 */}
            <div className="w-6 h-6 rounded-full bg-gray-600" />
            {/* 작성자 이름 자리 */}
            <div className="w-24 h-4 bg-gray-600 rounded" />
          </div>

          {/* 댓글 내용 영역 */}
          <div className="ml-8 space-y-2">
            <div className="w-3/4 h-3 bg-gray-700 rounded" />
            <div className="w-1/2 h-3 bg-gray-700 rounded" />
          </div>

          {/* 날짜 영역 */}
          <div className="ml-8 mt-2 w-20 h-3 bg-gray-800 rounded" />
        </div>
      ))}
    </div>
  );
};

export default CommentSkeleton;