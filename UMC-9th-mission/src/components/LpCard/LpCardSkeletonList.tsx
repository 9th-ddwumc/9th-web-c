import LpCardSkeleton from "./LpCardSkeleton";

interface LpCardSkeletonListProps {
  count: number;
}

//스켈레톤 카드를 'count' 개수만큼 목록으로 렌더링하는 컴포넌트
//"데이터 count개 가져올 거니까, 로딩 끝날 때까지 미리 count개만큼의 스켈레톤 UI로 자리를 만들어놔"
const LpCardSkeletonList = ({ count }: LpCardSkeletonListProps) => {
  return (
    <>
      {new Array(count).fill(0).map((_, idx) => (
        <LpCardSkeleton key={idx} />
      ))}
    </>
  );
};

export default LpCardSkeletonList;