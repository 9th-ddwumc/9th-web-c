import CommentListSkeleton from "./CommentListSkeleton"; 

interface CommentListSkeletonListProps {
  count: number;
}

const CommentListSkeletonList = ({
  count,
}: CommentListSkeletonListProps) => {
  return (
    <div className="space-y-4">
      {new Array(count).fill(0).map((_, idx) => (
        <CommentListSkeleton key={idx} /> 
      ))}
    </div>
  );
};
export default CommentListSkeletonList;