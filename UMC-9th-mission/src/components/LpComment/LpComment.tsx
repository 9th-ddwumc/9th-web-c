import { useEffect, useRef, useState } from "react";
import type { Comment } from "../../types/comment"; 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, updateComment } from "../../apis/lp";
import { Edit, MoreVertical, Trash2 } from "lucide-react";

interface LpCommentProps {
  comment: Comment;
  meId : number | undefined; // 현재 로그인한 유저 ID
}

//개별 댓글 하나를 렌더링하는 UI 컴포넌트
const LpComment = ({ comment, meId }: LpCommentProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthor = meId === comment.authorId;
  const queryKey = ["lpComments", String(comment.lpId)];

  //  댓글 삭제 Mutation 
  const deleteMutation = useMutation({
    // lpId와 commentId를 전달
    mutationFn: () => deleteComment({
      lpId: comment.lpId,
      commentId: comment.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제에 실패했습니다.");
    },
  });

  // 댓글 수정 Mutation 
  const updateMutation = useMutation({
    // lpId, commentId, content를 전달
    mutationFn: (newContent: string) =>
      updateComment({
        lpId: comment.lpId,
        commentId: comment.id,
        content: newContent
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setIsEditing(false);
    },
    onError: (err) => {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정에 실패했습니다.");
    },
  });

  const handleDelete = () => {
    if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      deleteMutation.mutate();
    }
  };

  const handleUpdate = () => {
    const contentToUpdate = editedContent.trim();
    if (contentToUpdate && contentToUpdate !== comment.content) {
      updateMutation.mutate(contentToUpdate);
    } else {
      setIsEditing(false);
      setEditedContent(comment.content);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow relative">
      <div className="flex items-center space-x-3">
        {/* 작성자 아바타 */}
        <img
          src={comment.author.avatar || "/default-avatar.png"}
          alt={comment.author.name}
          className="w-10 h-10 rounded-full bg-gray-600 object-cover"
        />
        <div className="flex-1">
          {/* 작성자 이름 */}
          <p className="font-semibold text-white">{comment.author.name}</p>
          <p className="text-sm text-gray-400">
            {/* 댓글 작성일 */}
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>

        {isAuthor && !isEditing && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white p-1 rounded-full"
            >
              <MoreVertical size={18} />
            </button>
            
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-gray-700 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 flex items-center gap-2"
                >
                  <Edit size={14} /> 수정
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-600 flex items-center gap-2"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={14} /> 삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-3 space-y-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={3}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={updateMutation.isPending}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedContent(comment.content);
              }}
              className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition text-sm"
              disabled={updateMutation.isPending}
            >
              취소
            </button>
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition text-sm"
              disabled={updateMutation.isPending || editedContent.trim().length === 0}
            >
              {updateMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-gray-200 whitespace-pre-line">
          {/* 댓글 내용 */}
          {comment.content}
        </p>
      )}
    </div>
  );
};

export default LpComment;