/**
 * LpCard의 로딩 상태를 표시하기 위한 스켈레톤 UI 컴포넌트
 * 실제 데이터가 로드되기 전에 이 컴포넌트가 먼저 표시됨
 */
const LpCardSkeleton = () => {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="bg-gray-300 w-full h-full"></div>
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
        <div className="bg-gray-400 h-4 w-full rounded-sm"></div>
      </div>
    </div>
  );
};

export default LpCardSkeleton;