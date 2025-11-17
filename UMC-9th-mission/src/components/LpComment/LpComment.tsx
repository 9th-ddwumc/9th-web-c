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
  // React Query의 클라이언트 인스턴스 (데이터 갱신/무효화에 사용)
  const queryClient = useQueryClient();
  // [State 관리]
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // [Ref] 메뉴 외부 클릭 감지를 위한 DOM 참조
  const menuRef = useRef<HTMLDivElement>(null);
  // [권한 체크] 로그인한 유저(meId)와 댓글 작성자(authorId)가 같은지 확인
  const isAuthor = meId === comment.authorId;
  // 이 댓글이 속한 리스트의 쿼리 키 (수정/삭제 후 목록을 새로고침하기 위해 필요)
  const queryKey = ["lpComments", String(comment.lpId)];

  /** 댓글 삭제 Mutation */  
  const deleteMutation = useMutation({
    // API 호출 함수 실행 & lpId와 commentId를 전달
    mutationFn: () => deleteComment({
      lpId: comment.lpId,
      commentId: comment.id
    }),
    // [성공 시]: 쿼리 키를 무효화(invalidate)하여 댓글 목록을 서버에서 다시 가져옴
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제에 실패했습니다.");
    },
  });

  //**댓글 수정 Mutation  */ 
  const updateMutation = useMutation({
    // lpId, commentId, content를 전달
    mutationFn: (newContent: string) =>
      updateComment({
        lpId: comment.lpId,
        commentId: comment.id,
        content: newContent
      }),
    // 성공 시 목록 갱신 및 수정 모드 종료
    onSuccess: () => {
      /** queryClient.invalidateQueries는 전달된 queryKey와 정확히 일치하는 쿼리만 찾는 것이 아니라, 
       * 전달된 queryKey로 시작하는 모든 쿼리를 무효화
       ** React Query가 queryKey로 시작하는 모든 쿼리를 찾으라고 명령하고,
       **useGetInfiniteLpComments에서의 queryKey가 ["lpComments", lpid, order]인 쿼리를 찾아내 무효화하고 새로고침함
       */
      queryClient.invalidateQueries({ queryKey });
      setIsEditing(false);
    },
    onError: (err) => {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정에 실패했습니다.");
    },
  });

  /** [핸들러] 삭제 버튼 클릭 시 */
  const handleDelete = () => {
    if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      // 삭제 요청 실행
      deleteMutation.mutate();
    }
  };

  // [핸들러] 수정 저장 버튼 클릭 시
  const handleUpdate = () => {
    const contentToUpdate = editedContent.trim();
    // 내용이 있고, 기존 내용과 다를 경우에만 요청 전송
    if (contentToUpdate && contentToUpdate !== comment.content) {
      updateMutation.mutate(contentToUpdate);
    } else {
      // 변경 사항이 없으면 그냥 수정 모드만 닫음
      setIsEditing(false);
      setEditedContent(comment.content);
    }
  };

  // [Effect] 메뉴가 열려있을 때 외부를 클릭하면 메뉴를 닫는 로직
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // menuRef가 존재하고, 클릭한 요소가 menuRef 내부에 포함되지 않을 경우
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
      {/* 상단 영역: 프로필, 이름, 날짜, 메뉴 버튼 */}
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

        {/* [조건부 렌더링]: 작성자 본인이고, 현재 수정 모드가 아닐 때만 메뉴(...) 노출 */}
        {isAuthor && !isEditing && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white p-1 rounded-full"
            >
              <MoreVertical size={18} />
            </button>
            
            {/* 드롭다운 메뉴 (수정/삭제 버튼) */}
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-gray-700 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setIsEditing(true); // 수정 모드로 전환
                    setIsMenuOpen(false); // 메뉴 닫기
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600 flex items-center gap-2"
                >
                  <Edit size={14} /> 수정
                </button>
                <button
                  onClick={() => {
                    handleDelete(); // 삭제 로직 실행
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

      {/* 본문 영역: 수정 모드 vs 조회 모드 */}  
      {isEditing ? (
        // [수정 모드 UI]
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
                setIsEditing(false); // 취소 시 수정 모드 종료
                setEditedContent(comment.content); // 내용 초기화
              }}
              className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition text-sm"
              disabled={updateMutation.isPending}
            >
              취소
            </button>
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition text-sm"
              // 로딩 중이거나 내용이 비어있으면 버튼 비활성화
              disabled={updateMutation.isPending || editedContent.trim().length === 0}
            >
              {updateMutation.isPending ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      ) : (
        // [조회 모드 UI]
        //whitespace-pre-line: 줄바꿈(\n)을 실제 줄바꿈으로 렌더링
        <p className="mt-3 text-gray-200 whitespace-pre-line">
          {/* 댓글 내용 */}
          {comment.content}
        </p>
      )}
    </div>
  );
};

export default LpComment;