import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
import type { LpComment } from "../../types/lpComment";
import useUpdateComment from "../../hooks/mutations/useUpdateComment";
import useDeleteComment from "../../hooks/mutations/useDeleteComment";
import { EllipsisVertical } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import type { ResponseMyInfoDto } from "../../types/auth";
import { getMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

interface CommentItemProps {
  lpId: number;
  comment: LpComment;
}

function CommentItem({ lpId, comment }: CommentItemProps) {
  // const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [menuOpen, setMenuOpen] = useState(false);

  const { mutate: updateCommentMutate } = useUpdateComment(lpId);
  const { mutate: deleteCommentMutate } = useDeleteComment(lpId);

  // const isAuthor = user?.data.id === comment.author?.id;
  // console.log("isAuthor:", isAuthor);

  const { data: myInfo } = useQuery<ResponseMyInfoDto>({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
  });

  const isMine = comment.authorId === myInfo?.data.id;

  const handleUpdate = () => {
    if (!editContent.trim()) return;

    updateCommentMutate(
      { lpId, id: comment.id, content: editContent },
      {
        onSuccess: () => {
          setIsEditing(false);
          alert("댓글이 수정되었습니다.");
        },
        onError: (error: any) => {
          console.error("댓글 수정 실패:", error);
          alert("댓글 수정에 실패했습니다.");
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    deleteCommentMutate(
      { lpId, id: comment.id },
      {
        onSuccess: () => {
          alert("댓글이 삭제되었습니다.");
        },
        onError: (error: any) => {
          console.error("댓글 삭제 실패:", error);
          alert("댓글 삭제에 실패했습니다.");
        },
      }
    );
  };

  return (
    <div className='group flex gap-4 p-5 bg-[#171717] rounded-xl relative'>
      <div className='w-11 h-11 rounded-full bg-gradient-to-br from-pink-600 to-pink-700
        flex items-center justify-center flex-shrink-0 overflow-hidden'>
        {comment.author?.avatar ? (
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className='w-full h-full object-cover'
          />
        ) : (
          <span className='text-white font-bold text-base'>
            {comment.author?.name?.charAt(0) ?? "?"}
          </span>
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-2'>
          <p className='text-sm text-pink-600 font-semibold'>
            {comment.author?.name ?? "Unknown"}
          </p>
          <span className='text-xs text-gray-600'>•</span>
          <p className='text-xs text-gray-500'>
            {new Date(comment.createdAt).toLocaleString('ko-KR', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>

          {/* 메뉴 버튼 */}
          {isMine && !isEditing && (
            <button
              className="ml-auto text-gray-400 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <EllipsisVertical size={20} />
            </button>
          )}

          {/* 메뉴 */}
          {isMine && menuOpen && (
            <div className="absolute right-0 top-8 bg-[#222] border border-gray-700 rounded-md shadow-md z-50">
              <button
                className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left"
                onClick={() => {
                  setIsEditing(true);
                  setMenuOpen(false);
                }}
              >
                수정
              </button>
              <button
                className="block px-4 py-2 text-sm text-pink-600 hover:bg-gray-700 w-full text-left"
                onClick={() => {
                  handleDelete();
                  setMenuOpen(false);
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 댓글 수정창 */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full bg-[#222] text-gray-200 text-m leading-relaxed 
                border border-gray-600 rounded-lg px-3 py-2 focus:outline-none 
                focus:border-pink-600 resize-none"
              rows={2}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white 
                  bg-[#222] hover:bg-[#2a2a2a] rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1.5 text-sm text-white bg-pink-600 
                  hover:bg-pink-700 rounded-lg transition-colors"
              >
                수정
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-200 text-m leading-relaxed break-words mt-1">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
}

export default CommentItem;