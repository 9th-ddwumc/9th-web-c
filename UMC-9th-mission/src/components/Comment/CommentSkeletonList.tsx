import CommentSkeleton from "./CommentSkeleton";

interface CommentSkeletonListProps {
    count: number;
}

const CommentSkeletonList = ({ count }: CommentSkeletonListProps) => {
    return (
        <div className="space-y-4">
            {new Array(count).fill(0).map((_, idx) => (
                <CommentSkeleton key={idx} />
            ))}
        </div>
    );
};

export default CommentSkeletonList;