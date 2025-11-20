import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Edit2, Trash2, Check } from "lucide-react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import Comment from "../components/Comment/Comment";
import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import useDeleteLp from "../hooks/mutations/useDeleteLp";
import usePatchLp from "../hooks/mutations/usePatchLp";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";

const LpDetailPage = () => {
  const { id } = useParams();
  const lpIdNumber = id ? Number(id) : undefined;
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const { data: lpDetail, isPending, isError, refetch } = useGetLpDetail(lpIdNumber);
  const { data: me } = useGetMyInfo(accessToken);
  const deleteLpMutate = useDeleteLp();
  const updateLpMutate = usePatchLp();
  const postLikeMutate = usePostLike();
  const deleteLikeMutate = useDeleteLike();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 수정 모드에서만 사용하는 수정용 tags
  const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isPending) return <div>로딩중...</div>;
  if (isError || !lpDetail)
    return (
      <div>
        데이터 로딩 실패
        <button onClick={() => refetch()}>다시 시도</button>
      </div>
    );

  const isOwner = lpDetail.authorId === me?.data.id;

  // 수정 모드 ON 시 기존 데이터 세팅
  const startEditing = () => {
    setIsEditing(true);
    setTitle(lpDetail.title);
    setContent(lpDetail.content);
    setThumbnail(lpDetail.thumbnail);
    setTags(lpDetail.tags ?? []);
  };

const handleToggleLike = () => {
  const hasLiked = lpDetail.likes?.some((like) => like.userId === me?.data.id);

  if (!lpIdNumber || !me?.data.id) return;

  if (hasLiked) {
    // 좋아요 취소
    deleteLikeMutate.mutate(
      { lpId: lpIdNumber },
      {
        onSuccess: () => refetch(),
        onError: () => alert("좋아요 취소 실패"),
      }
    );
  } else {
    // 좋아요
    postLikeMutate.mutate(
      { lpId: lpIdNumber },
      {
        onSuccess: () => refetch(),
        onError: () => alert("좋아요 실패"),
      }
    );
  }
};

  // 이미지 변경
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
      setThumbnail(file.name);
    }
  };

  // 삭제
  const handleDelete = () => {
    if (!confirm("정말 LP를 삭제하시겠습니까?")) return;

    deleteLpMutate.mutate(
      { lpId: lpIdNumber! },
      {
        onSuccess: () => {
          alert("LP 삭제됨");
          navigate("/");
        },
        onError: () => alert("삭제 실패"),
      }
    );
  };

  // 업데이트
  const handleUpdate = () => {
    updateLpMutate.mutate(
      {
        lpId: lpIdNumber!,
        lpData: {
          ...lpDetail,
          title,
          content,
          thumbnail,
          tags: tags.map((t) => t.name), // ← name 배열로
        },
      },
      {
        onSuccess: () => {
          alert("LP 수정 완료");
          setIsEditing(false);
        },
        onError: () => alert("수정 실패"),
      }
    );
  };

  return (
    <div className="pb-10 mt-20">
      <div className="bg-[#1f1f1f] rounded-3xl max-w-3xl mx-auto p-6 text-white space-y-6">
        
        {/* 상단 정보 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={lpDetail.author.avatar ?? "/avatar.jpg"}
              alt={lpDetail.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-semibold">{lpDetail.author.name}</span>
          </div>
          <div className="text-gray-400 text-sm">
            {new Date(lpDetail.createdAt).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>

        {/* 제목 */}
        <div className="flex justify-between items-center">
          {isEditing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl font-bold bg-gray-800 px-2 py-1 rounded"
            />
          ) : (
            <h1 className="text-3xl font-bold">{lpDetail.title}</h1>
          )}

          {isOwner && (
            <div className="flex gap-3">
              {isEditing ? (
                <div onClick={handleUpdate} className="cursor-pointer text-gray-400 hover:text-white">
                  <Check className="w-5 h-5" />
                </div>
              ) : (
                <div onClick={startEditing} className="cursor-pointer text-gray-400 hover:text-white">
                  <Edit2 className="w-5 h-5" />
                </div>
              )}
              <div onClick={handleDelete} className="cursor-pointer text-gray-400 hover:text-white">
                <Trash2 className="w-5 h-5" />
              </div>
            </div>
          )}
        </div>

        {/* 썸네일 */}
        <div className="w-full flex justify-center items-center my-6">
          <div className="relative">
            <img
              src={previewImage || lpDetail.thumbnail || "/default-thumbnail.jpg"}
              alt="LP 썸네일"
              className={`w-64 h-64 rounded-full object-cover border-4 border-gray-500 shadow-xl ${
                isEditing ? "cursor-pointer hover:opacity-80 transition" : ""
              }`}
              onClick={() => isEditing && fileInputRef.current?.click()}
            />

            {isEditing && (
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            )}

            {!isEditing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">▶</div>
              </div>
            )}
          </div>
        </div>

        {/* 설명 */}
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-800 px-2 py-1 rounded"
          />
        ) : (
          <p className="text-gray-300 text-lg leading-relaxed line-clamp-3">
            {lpDetail.content}
          </p>
        )}

        {/* 태그 */}
        {isEditing ? (
          <input
            value={tags.map((t) => t.name).join(", ")}
            onChange={(e) =>
              setTags(
                e.target.value.split(",").map((t) => ({
                  id: 0,
                  name: t.trim(),
                }))
              )
            }
            className="w-full bg-gray-800 px-2 py-1 rounded"
          />
        ) : (
          <div className="flex gap-2 flex-wrap">
            {(lpDetail.tags ?? []).map((tag, index) => (
              <span key={tag.id || index} className="bg-gray-600 px-2 py-1 rounded">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* 좋아요 */}
        <div
            className="flex justify-center items-center mt-4 gap-2 cursor-pointer"
            onClick={handleToggleLike}
        >
          <Heart
            className={`w-6 h-6 ${
              lpDetail.likes?.some((like) => like.userId === me?.data.id)
                ? "text-pink-500 fill-current"
                : "text-gray-400"
            }`}
          />
          <span className="text-white font-semibold">{lpDetail.likes?.length ?? 0}</span>
        </div>


        {/* 댓글 */}
        {lpIdNumber !== undefined && <Comment lpid={lpIdNumber} />}
      </div>
    </div>
  );
};

export default LpDetailPage;