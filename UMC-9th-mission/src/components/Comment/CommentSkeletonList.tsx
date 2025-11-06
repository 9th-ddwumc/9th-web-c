import CommentSkeleton from "./CommentSkeleton";

interface CommentSkeletonListProps {
    count: number;
}

const CommentSkeletonList = ({ count }: CommentSkeletonListProps) => {
    return (
        <div className="w-full">
            {new Array(count).fill(0).map((_, idx) => (
                <CommentSkeleton key={idx} />
            ))}
        </div>
    );
};

export default CommentSkeletonList;