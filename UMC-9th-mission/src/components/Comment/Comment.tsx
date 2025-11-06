import { useState } from "react";
import { OrderButton } from "../OrderButton";
import useGetInfiniteCommentList from "../../hooks/queries/useGetInfiniteCommentList";
import { PAGENATION_ORDER } from "../../enums/common";
import { useInView } from "react-intersection-observer";
import CommentSkeletonList from "./CommentSkeletonList";
import { MoreVertical } from "lucide-react"; // ✅ 추가

interface CommentProps {
  lpid: number;
}

const Comment = ({ lpid }: CommentProps) => {
  const [order, setOrder] = useState<PAGENATION_ORDER>(PAGENATION_ORDER.desc);
  const [newComment, setNewComment] = useState("");
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetInfiniteCommentList(lpid, 5, order);

  // 스크롤 감지해서 다음 페이지 불러오기
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    console.log("댓글 작성:", newComment);
    setNewComment("");
  };

  return (
    <div className="w-full text-white">
      {/* 상단: 제목 + 정렬 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold w-10">댓글</h2>
        <OrderButton order={order} setOrder={setOrder} />
      </div>

      {/* 댓글 입력 영역 */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력해주세요"
          className="flex-1 rounded-full border border-white bg-transparent px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          className="bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-500"
        >
          작성
        </button>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {isLoading && <p>댓글 불러오는 중...</p>}
        {isError && <p>댓글을 불러오는데 실패했습니다.</p>}

        {data?.pages.map((page) =>
          page.data.data.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-gray-700 pb-3"
            >
              {/* 작성자 + 메뉴 버튼 */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {comment.author.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-600" />
                  )}
                  <p className="font-medium text-white">
                    {comment.author.name}
                  </p>
                </div>

                {/* 오른쪽 점 세개 버튼 */}
                <button className="text-gray-400 hover:text-white transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* 댓글 내용 */}
              <p className="text-gray-300 ml-8 mt-1">{comment.content}</p>
              <p className="text-gray-500 text-sm ml-8">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}

        {/* 무한스크롤 트리거 */}
        <div ref={ref} />
        {isFetchingNextPage && <CommentSkeletonList count={3} />}
      </div>
    </div>
  );
};

export default Comment;
