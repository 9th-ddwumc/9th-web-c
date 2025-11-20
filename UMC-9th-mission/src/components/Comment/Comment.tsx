import { useState } from "react";
import { OrderButton } from "../OrderButton";
import useGetInfiniteCommentList from "../../hooks/queries/useGetInfiniteCommentList";
import { PAGENATION_ORDER } from "../../enums/common";
import { useInView } from "react-intersection-observer";
import CommentSkeletonList from "./CommentSkeletonList";
import { MoreVertical, Pencil, Trash2, Check, X } from "lucide-react";
import usePostComment from "../../hooks/mutations/usePostConmment";
import useGetMyInfo from "../../hooks/queries/useGetMyInfo";
import useDeleteComment from "../../hooks/mutations/useDeleteComment";
import usePatchComment from "../../hooks/mutations/usePatchComment";

interface CommentProps {
  lpid: number;
}

const Comment = ({ lpid }: CommentProps) => {
  const [order, setOrder] = useState<PAGENATION_ORDER>(PAGENATION_ORDER.desc);
  const [newComment, setNewComment] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null); // ✅ 현재 수정 중인 댓글 ID
  const [editContent, setEditContent] = useState(""); // ✅ 수정 중인 댓글 내용
  const { ref, inView } = useInView();

  const accessToken = localStorage.getItem("accessToken");
  const { data: myInfo } = useGetMyInfo(accessToken);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetInfiniteCommentList(lpid, 5, order);

  const { mutate: postCommentMutate } = usePostComment();
  const { mutate: deleteCommentMutate } = useDeleteComment();
  const { mutate: patchCommentMutate } = usePatchComment();

  // 🔁 무한스크롤
  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  // ✏️ 댓글 작성
  const handleSubmit = () => {
    const content = newComment.trim();
    if (!content) return;
    postCommentMutate(
      { lpId: lpid, content },
      {
        onSuccess: () => {
          setNewComment("");
        },
      }
    );
  };

  // 메뉴 토글
  const toggleMenu = (commentId: number) => {
    setOpenMenuId(openMenuId === commentId ? null : commentId);
  };

  // 🗑️ 댓글 삭제
  const handleDelete = (commentId: number) => {
    deleteCommentMutate(
      { lpId: lpid, id: commentId },
      {
        onSuccess: () => {
          setOpenMenuId(null);
        },
      }
    );
  };

  // ✏️ 수정 시작
  const handleEditStart = (commentId: number, content: string) => {
    setEditId(commentId);
    setEditContent(content);
    setOpenMenuId(null);
  };

  // ✅ 수정 저장
  const handleEditSave = (commentId: number) => {
    const content = editContent.trim();
    if (!content) return;
    patchCommentMutate(
      { lpId: lpid, id: commentId, content },
      {
        onSuccess: () => {
          setEditId(null);
          setEditContent("");
        },
      }
    );
  };

  // ❌ 수정 취소
  const handleEditCancel = () => {
    setEditId(null);
    setEditContent("");
  };

  return (
    <div className="w-full text-white relative">
      {/* 상단 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold w-10">댓글</h2>
        <OrderButton order={order} setOrder={setOrder} />
      </div>

      {/* 댓글 입력 */}
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
            <div key={comment.id} className="relative border-b border-gray-700 pb-3">
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
                  <p className="font-medium text-white">{comment.author.name}</p>
                </div>

                {/* 본인 댓글일 때만 메뉴 */}
                {comment.author.id === myInfo?.data.id && (
                  <div className="relative">
                    <button
                      className="text-gray-400 hover:text-white transition-colors"
                      onClick={() => toggleMenu(comment.id)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuId === comment.id && (
                      <div className="absolute right-0 mt-2 bg-gray-800 rounded-lg shadow-lg py-2 z-10 w-20">
                        <button
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-left text-sm whitespace-nowrap"
                          onClick={() => handleEditStart(comment.id, comment.content)}
                        >
                          <Pencil className="w-4 h-4" />
                          수정
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 w-full text-left text-sm text-red-400 whitespace-nowrap"
                          onClick={() => handleDelete(comment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ✅ 댓글 내용 / 수정 중 여부에 따라 다르게 렌더링 */}
              {editId === comment.id ? (
                <div className="flex items-center gap-2 ml-8 mt-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 bg-transparent border border-gray-500 rounded px-2 py-1 text-white focus:outline-none"
                  />
                  <button
                    onClick={() => handleEditSave(comment.id)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-gray-300 ml-8 mt-1">{comment.content}</p>
              )}

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