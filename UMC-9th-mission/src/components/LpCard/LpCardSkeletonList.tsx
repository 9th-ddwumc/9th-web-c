import LpCardSkeleton from "./LpCardSkeleton";

interface LpCardSkeletonListProps {
    count: number;
}

const LpCardSkeletonList = ({ count }: LpCardSkeletonListProps) => {
    return (
                <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-6">
            {new Array(count).fill(0).map((_, idx) => (
                <LpCardSkeleton key={idx} />
            ))}
        </div>
    );
};

export default LpCardSkeletonList;
