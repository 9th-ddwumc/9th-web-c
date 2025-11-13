import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, Pencil, Trash2, Check, X } from "lucide-react";
import { getMyInfo } from "../apis/auth";

import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import type { ResponseMyInfoDto } from "../types/auth";
import { useUpdateLp } from "../hooks/mutations/useUpdateLp";
import { useDeleteLp } from "../hooks/mutations/useDeleteLp";
import CommentSection from "../components/Comment/CommentSection";
import { QUERY_KEY } from "../constants/key";

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();

  const {
    data: lp,
    isPending,
    isError,
    refetch,
  } = useGetLpDetail({ lpId: Number(lpId) });

  const { data: myInfo } = useQuery<ResponseMyInfoDto>({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: getMyInfo,
  });

  const { mutate: updateLpMutate } = useUpdateLp();
  const { mutate: deleteLpMutate } = useDeleteLp();
  const { mutate: likeMutate } = usePostLike();
  const { mutate: dislikeMutate } = useDeleteLike();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  if (isPending) return <LoadingSpinner />;
  if (isError || !lp?.data) return <ErrorMessage onRetry={refetch} />;

  const isMine = lp.data.authorId === myInfo?.data.id;
  const isLiked = lp.data.likes?.some((like) => like.userId === myInfo?.data?.id);

  const handleEditStart = () => {
    setEditTitle(lp.data.title);
    setEditContent(lp.data.content);
    setEditTags(lp.data.tags.map((tag) => tag.name));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditTitle(lp.data.title);
    setEditContent(lp.data.content);
    setEditTags(lp.data.tags.map((tag) => tag.name));
    setIsEditing(false);
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !editTags.includes(trimmed)) {
      setEditTags([...editTags, trimmed]);
    }
    setTagInput("");
  };

  const handleDeleteTag = (tag: string) => {
    setEditTags(editTags.filter((t) => t !== tag));
  };

  const handleLikeLp = () => {
    likeMutate({ lpId: Number(lpId) });
  };

  const handleDisLikeLp = () => {
    dislikeMutate({ lpId: Number(lpId) });
  };

  const handleUpdate = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    updateLpMutate(
      {
        lpId: Number(lpId),
        title: editTitle,
        content: editContent,
        tags: editTags,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          alert("LP가 수정되었습니다.");
        },
        onError: (error: any) => {
          console.error("LP 수정 실패:", error);
          alert("LP 수정에 실패했습니다.");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!confirm("LP를 삭제하시겠습니까?")) return;

    deleteLpMutate(
      { lpId: Number(lpId) },
      {
        onSuccess: () => {
          alert("LP가 삭제되었습니다.");
          navigate("/");
        },
        onError: (error: any) => {
          console.error("LP 삭제 실패:", error);
          alert("LP 삭제에 실패했습니다.");
        },
      }
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto text-white">
      {/* 제목 */}
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-2xl font-bold mb-2 bg-[#222] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-pink-600"
          placeholder="제목을 입력하세요"
          autoFocus
        />
      ) : (
        <h1 className="text-2xl font-bold mb-2">{lp.data.title}</h1>
      )}

      <p className="text-gray-500 mb-4">
        {new Date(lp.data.createdAt).toLocaleDateString()}
      </p>

      {/* 수정/삭제 버튼 */}
      {isMine && (
        <div className="flex justify-end gap-4 mb-4">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="hover:text-gray-400 transition-colors flex items-center gap-1"
              >
                <X size={18} />
              </button>
              <button
                onClick={handleUpdate}
                className="hover:text-pink-500 transition-colors flex items-center gap-1"
              >
                <Check size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditStart}
                className="hover:text-gray-400 transition-colors flex items-center gap-1"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={handleDelete}
                className="hover:text-gray-400 transition-colors flex items-center gap-1"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      )}

      {/* 썸네일 */}
      {lp.data.thumbnail && (
        <div className="aspect-square rounded-lg overflow-hidden mb-4 max-w-md mx-auto">
          <img
            src={lp.data.thumbnail}
            alt={lp.data.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      {/* 내용 */}
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full mb-4 bg-[#222] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-pink-600 resize-none"
          rows={4}
          placeholder="내용을 입력하세요"
        />
      ) : (
        <div className="mb-4 whitespace-pre-wrap">{lp.data.content}</div>
      )}

      {/* 태그 */}
      {isEditing ? (
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mt-2 mb-4">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="태그를 입력하세요"
              className="bg-[#222] border border-gray-600 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-pink-600"
            />
            <button
              onClick={handleAddTag}
              className="bg-pink-600 text-white px-3 py-1 rounded-lg hover:bg-pink-700"
            >
              추가
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {editTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 bg-pink-600 text-white px-3 py-1 rounded-full text-sm"
              >
                <span>#{tag}</span>
                <button
                  onClick={() => handleDeleteTag(tag)}
                  className="text-white hover:text-gray-300 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        lp.data.tags &&
        lp.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            {lp.data.tags.map((tag) => (
              <div
                key={tag.id || tag.name}
                className="flex items-center gap-1 bg-pink-600 text-white px-3 py-1 rounded-full text-sm"
              >
                <span>#{tag.name}</span>
              </div>
            ))}
          </div>
        )
      )}

      {/* 좋아요 */}
      <div className="flex items-center gap-2 mt-2 mb-6">
        <button
          onClick={isLiked ? handleDisLikeLp : handleLikeLp}
          className="cursor-pointer"
        >
          <Heart
            color={isLiked ? "red" : "white"}
            fill={isLiked ? "red" : "transparent"}
          />
        </button>
        <span>{lp.data.likes?.length || 0}</span>
      </div>

      {/* 댓글 섹션 */}
      <CommentSection lpId={Number(lpId)} />
    </div>
  );
};

export default LpDetailPage;