export const LoadingSpinner = () => {
    return (
        <div
            className="w-12 h-12 animate-spin rounded-full border-6 border-t-transparent border-blue-500"
            role="status"
        >
            <span className="sr-only">로딩 중...</span>
        </div>
        
    );
};
