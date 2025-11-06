const CommentListSkeleton = () => {
  return (
    // 'animate-pulse'를 사용하여 메인 화면과 동일한 애니메이션 재사용
    <div className="p-4 bg-gray-800 rounded-lg shadow animate-pulse">
      <div className="flex items-center space-x-3">
        {/* 아바타 스켈레톤 */}
        <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
        <div className="flex-1 space-y-2">
          {/* 작성자 스켈레톤 */}
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          {/* 댓글 내용 스켈레톤 */}
          <div className="h-5 bg-gray-600 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  );
};
export default CommentListSkeleton;